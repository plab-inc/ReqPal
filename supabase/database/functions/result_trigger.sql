DROP FUNCTION IF EXISTS evaluate_answers_function();
DROP FUNCTION IF EXISTS evaluate_answers_on_update_function();
DROP TRIGGER IF EXISTS user_answers_insert_trigger ON user_answers;
DROP TRIGGER user_answers_update_trigger ON user_answers;

---
-- EVALUATE AND CALCULATE SCORE ON ANSWER INSERTION
---
CREATE OR REPLACE FUNCTION evaluate_answers_function()
    RETURNS TRIGGER AS
$$
DECLARE
    result_value   jsonb;
    lesson_points  double precision := 0;
    current_points double precision := 0;
    new_points     double precision := 0;
BEGIN
    IF NEW.question_id IS NOT NULL THEN
        IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'TrueOrFalse' THEN
            result_value := evaluate_true_or_false(NEW.question_id, NEW.answer, NEW.max_points);
        ELSE
            IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'MultipleChoice' THEN
                result_value := evaluate_multiple_choice(NEW.question_id, NEW.answer, NEW.max_points);
            ELSE
                IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'Slider' THEN
                    result_value := evaluate_slider(NEW.question_id, NEW.answer, NEW.max_points);
                ELSE
                    IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'Requirement' THEN
                        result_value := evaluate_product_qualification(NEW.question_id, NEW.answer, NEW.max_points);
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    NEW.result := result_value;

    SELECT user_points.points
    INTO current_points
    FROM user_points
    WHERE user_id = auth.uid();

    new_points := NEW.result ->> 'score';

    IF NOT FOUND THEN
        INSERT INTO user_points (user_id, points)
        VALUES (auth.uid(), new_points);
    ELSE
        UPDATE user_points
        SET points = current_points + new_points
        WHERE user_id = auth.uid();
    END IF;

    SELECT user_finished_lessons.user_points
    INTO lesson_points
    FROM user_finished_lessons
    WHERE user_id = auth.uid()
      AND lesson_id = NEW.lesson_id;

    IF NOT FOUND THEN
        lesson_points := 0;
    ELSE
        IF lesson_points IS NULL THEN
            lesson_points := 0;
        END IF;
    END IF;

    UPDATE user_finished_lessons
    SET user_points = lesson_points + new_points
    WHERE user_id = auth.uid()
      AND lesson_id = NEW.lesson_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION evaluate_answers_on_update_function()
    RETURNS TRIGGER AS
$$
DECLARE
    result_value jsonb;
BEGIN
    IF NEW.question_id IS NOT NULL THEN
        IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'TrueOrFalse' THEN
            result_value := evaluate_true_or_false(NEW.question_id, NEW.answer, NEW.max_points);
        ELSE
            IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'MultipleChoice' THEN
                result_value := evaluate_multiple_choice(NEW.question_id, NEW.answer, NEW.max_points);
            ELSE
                IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'Slider' THEN
                    result_value := evaluate_slider(NEW.question_id, NEW.answer, NEW.max_points);
                ELSE
                    IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'Requirement' THEN
                        result_value := evaluate_product_qualification(NEW.question_id, NEW.answer, NEW.max_points);
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    NEW.result := result_value;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_answers_insert_trigger
    BEFORE INSERT
    ON user_answers
    FOR EACH ROW
EXECUTE FUNCTION evaluate_answers_function();

CREATE TRIGGER user_answers_update_trigger
    BEFORE UPDATE
    ON user_answers
    FOR EACH ROW
EXECUTE FUNCTION evaluate_answers_on_update_function();

---
-- DELETE USER ANSWERS IF LESSON FINISHED DELETED
---

DROP FUNCTION IF EXISTS delete_user_answers();
DROP TRIGGER IF EXISTS user_finished_lesson_delete_trigger ON user_finished_lessons;

CREATE OR REPLACE FUNCTION delete_user_answers()
    RETURNS TRIGGER AS
$$
BEGIN

    DELETE
    FROM user_answers
    WHERE lesson_id = OLD.lesson_id
      AND user_id = OLD.user_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_finished_lesson_delete_trigger
    AFTER DELETE
    ON user_finished_lessons
    FOR EACH ROW
EXECUTE FUNCTION delete_user_answers();

---
-- DELETE USER PROGRESS AND USED HINTS IF LESSON FINISHED INSERT
---

DROP FUNCTION IF EXISTS delete_user_progress_and_hints();
DROP TRIGGER IF EXISTS user_finished_lesson_insert_trigger ON user_finished_lessons;
DROP TRIGGER IF EXISTS user_finished_lesson_insert_trigger ON user_finished_lessons;

CREATE OR REPLACE FUNCTION delete_user_progress_and_hints()
    RETURNS TRIGGER AS
$$
BEGIN
    DELETE
    FROM user_lesson_progress
    WHERE lesson_id = NEW.lesson_id
      AND user_id = NEW.user_id;

    DELETE
    FROM user_hints
    WHERE lesson_id = NEW.lesson_id
      AND user_id = NEW.user_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_finished_lesson_insert_trigger
    AFTER INSERT
    ON user_finished_lessons
    FOR EACH ROW
EXECUTE FUNCTION delete_user_progress_and_hints();

CREATE TRIGGER user_finished_lesson_update_trigger
    AFTER UPDATE
    ON user_finished_lessons
    FOR EACH ROW
EXECUTE FUNCTION delete_user_progress_and_hints();

