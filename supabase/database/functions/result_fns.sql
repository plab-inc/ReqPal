DROP FUNCTION IF EXISTS evaluate_true_or_false(uuid, uuid, jsonb);
DROP FUNCTION IF EXISTS create_user_answers_from_json(jsonb);

CREATE OR REPLACE FUNCTION create_user_answers_from_json(data jsonb)
    RETURNS VOID AS
$$
DECLARE
lesson_uuid uuid;
    answer jsonb;
    question_uuid uuid;
    lesson_finished bool := false;
BEGIN
    lesson_uuid := data ->> 'uuid';

SELECT finished
INTO lesson_finished
FROM user_finished_lessons
WHERE lesson_id = lesson_uuid;

IF NOT FOUND THEN
        INSERT INTO user_finished_lessons (user_id, lesson_id, finished)
        VALUES (auth.uid(), lesson_uuid, TRUE);
        lesson_finished := FALSE;
END IF;

    IF (NOT lesson_finished) THEN
        FOR answer IN SELECT * FROM jsonb_array_elements(data -> 'answers')
                                               LOOP
    question_uuid := (answer ->> 'uuid')::uuid;
INSERT INTO user_answers (user_id, lesson_id, question_id, answer)
VALUES (auth.uid(), lesson_uuid, question_uuid, answer -> 'options');
END LOOP;
END IF;
END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION evaluate_true_or_false(question_id uuid, answer_id uuid, answer jsonb)  RETURNS jsonb
AS $$
DECLARE
solution jsonb;
    compared_result bool;
    user_result jsonb;
BEGIN

SELECT questions.solution
INTO solution
FROM questions
WHERE questions.uuid = question_id;

compared_result := (solution = answer);

    user_result := to_jsonb(compared_result);

return user_result;
END;
$$ LANGUAGE plpgsql;

