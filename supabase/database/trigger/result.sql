-- Author: Laura

create or replace function evaluate_answers() returns trigger
    language plpgsql
as
$$
DECLARE
    result_value   jsonb;
    lesson_points  double precision := 0;
    current_points double precision := 0;
    new_points     double precision := 0;
    lesson_finished_first_time bool := false;
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

    SELECT finished_for_first_time
    INTO lesson_finished_first_time
    FROM user_finished_lessons
    WHERE lesson_id = NEW.lesson_id
      AND user_id = auth.uid();

    IF lesson_finished_first_time THEN

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
    end if;

    RETURN NEW;
END;
$$;

drop trigger if exists evaluate_answers_update_trigger on user_answers;

create trigger evaluate_answers_update_trigger
    before update
    on user_answers
    for each row
execute procedure evaluate_answers();

drop trigger if exists evaluate_answers_insert_trigger on user_answers;
create trigger evaluate_answers_insert_trigger
    before insert
    on user_answers
    for each row
execute procedure evaluate_answers();

create or replace function delete_user_answers() returns trigger
    language plpgsql
as
$$
BEGIN

    DELETE FROM user_answers
    WHERE lesson_id = OLD.lesson_id AND user_id = OLD.user_id;

    RETURN OLD;
END;
$$;

drop trigger if exists delete_user_hints_trigger on user_lesson_progress;
drop function delete_user_hints();

create or replace function delete_user_hints() returns trigger
    language plpgsql
as
$$
BEGIN
    DELETE
    FROM user_hints
    WHERE lesson_id = OLD.lesson_id
      AND user_id = OLD.user_id;

    RETURN OLD;
END;
$$;

create trigger delete_user_hints_trigger
    after delete
    on user_lesson_progress
    for each row
execute procedure delete_user_hints();

drop trigger if exists delete_user_answers_trigger on user_finished_lessons;
create trigger delete_user_answers_trigger
    after delete
    on user_finished_lessons
    for each row
execute procedure delete_user_answers();

create or replace function delete_user_progress_and_hints() returns trigger
    language plpgsql
as
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
$$;

drop trigger if exists delete_user_progress_and_hints_trigger on user_finished_lessons;
create trigger delete_user_progress_and_hints_trigger
    after insert OR update
    on user_finished_lessons
    for each row execute procedure delete_user_progress_and_hints();