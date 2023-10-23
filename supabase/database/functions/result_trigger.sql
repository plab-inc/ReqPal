DROP FUNCTION IF EXISTS evaluate_answers_function();
DROP TRIGGER IF EXISTS user_answers_insert_trigger ON user_answers;

CREATE OR REPLACE FUNCTION evaluate_answers_function()
    RETURNS TRIGGER AS $$
DECLARE
result_value jsonb;
BEGIN
    IF NEW.question_id IS NOT NULL THEN
        IF (SELECT question_type FROM questions WHERE uuid = NEW.question_id) = 'TrueOrFalse' THEN
            result_value := evaluate_true_or_false(NEW.question_id, NEW.uuid, NEW.answer);
END IF;
END IF;
    NEW.result := result_value;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER user_answers_insert_trigger on user_answers;

CREATE TRIGGER user_answers_insert_trigger
    BEFORE INSERT ON user_answers
    FOR EACH ROW
    EXECUTE FUNCTION evaluate_answers_function();