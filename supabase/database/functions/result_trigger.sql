DROP FUNCTION IF EXISTS evaluate_answers_function();
DROP TRIGGER IF EXISTS user_answers_insert_trigger ON user_answers;

CREATE OR REPLACE FUNCTION evaluate_answers_function()
    RETURNS TRIGGER AS
$$
DECLARE
    result_value   jsonb;
    current_points int4 := 0;
    new_points     int4 := 0;
BEGIN
    IF NEW.question_id IS NOT NULL THEN
        IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'TrueOrFalse' THEN
            result_value := evaluate_true_or_false(NEW.question_id, NEW.answer, NEW.max_points);
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

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER user_answers_insert_trigger on user_answers;

CREATE TRIGGER user_answers_insert_trigger
    BEFORE INSERT
    ON user_answers
    FOR EACH ROW
EXECUTE FUNCTION evaluate_answers_function();