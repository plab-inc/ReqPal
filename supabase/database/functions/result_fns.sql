DROP FUNCTION IF EXISTS evaluate_true_or_false(uuid, jsonb, float);
DROP FUNCTION IF EXISTS create_user_answers_from_json(jsonb);

CREATE
    OR REPLACE FUNCTION create_user_answers_from_json(data jsonb)
    RETURNS VOID AS
$$
DECLARE
    lesson_uuid uuid;
    answer jsonb;
    question_uuid uuid;
    lesson_finished bool := false;
    max_points int4 := 0;
    points_per_question int4 := 0;
BEGIN
    lesson_uuid := data ->> 'uuid';

    SELECT lessons.points
    INTO max_points
    FROM lessons
    WHERE uuid = lesson_uuid;

    points_per_question := max_points / jsonb_array_length(data -> 'answers');

    SELECT finished
    INTO lesson_finished
    FROM user_finished_lessons
    WHERE lesson_id = lesson_uuid AND user_id = auth.uid();

    IF NOT FOUND THEN
        INSERT INTO user_finished_lessons (user_id, lesson_id, finished)
        VALUES (auth.uid(), lesson_uuid, TRUE);
        lesson_finished
            := FALSE;
    END IF;

    IF (NOT lesson_finished) THEN
        FOR answer IN
            SELECT *
            FROM jsonb_array_elements(data -> 'answers')
            LOOP
                question_uuid := (answer ->> 'uuid')::uuid;
                INSERT INTO user_answers (user_id, lesson_id, question_id, answer, max_points)
                VALUES (auth.uid(), lesson_uuid, question_uuid, answer -> 'options', points_per_question);

            END LOOP;
    END IF;

    UPDATE user_finished_lessons
    SET finished = TRUE
    WHERE lesson_id = lesson_uuid AND user_id = auth.uid();
END;
$$
    LANGUAGE plpgsql;

--------------------------------------------
-- EVALUATION FUNCTIONS
--------------------------------------------

CREATE
    OR REPLACE FUNCTION evaluate_true_or_false(question_id uuid, answer jsonb, max_points int4) RETURNS jsonb
AS
$$
DECLARE
    solution jsonb;
    compared_result bool;
    user_result jsonb;
    score int4 := max_points;
BEGIN

    SELECT questions.solution
    INTO solution
    FROM questions
    WHERE questions.uuid = question_id;

    compared_result := (solution = answer);

    user_result := to_jsonb(compared_result);

    IF
        (user_result) THEN
        score := max_points;
    END IF;

    return jsonb_build_object('isCorrect', compared_result, 'score', score);

END;
$$
    LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS evaluate_multiple_choice(uuid, jsonb, double precision);

CREATE
    OR REPLACE FUNCTION evaluate_multiple_choice(question_id uuid, answer jsonb, max_points double precision) RETURNS jsonb
AS
$$
DECLARE
    solution jsonb;
    compared_result jsonb;
    user_result jsonb;
    score int4 := 0;
    percentage float := 1.0;
    correctAnswers float := 0;
    totalAnswers float := 0;
    result jsonb;
BEGIN

    SELECT questions.solution
    INTO solution
    FROM questions
    WHERE questions.uuid = question_id;

    compared_result := json_agg(jsonb_build_object(
            'id', q_option->>'id',
            'isCorrect', (q_option->>'solution')::BOOLEAN = (o_option->>'input')::BOOLEAN
        ))
                       FROM json_array_elements(solution::JSON) AS q_option
                                LEFT JOIN json_array_elements(answer::JSON) AS o_option ON (q_option->>'id')::int = (o_option->>'id')::int;

    FOR result IN SELECT * FROM jsonb_array_elements(compared_result)
        LOOP
            IF (result->>'isCorrect')::BOOLEAN THEN
                correctAnswers := correctAnswers + 1;
            END IF;
        END LOOP;

    totalAnswers := jsonb_array_length(answer);
    percentage := correctAnswers / totalAnswers;
    score := max_points*percentage;

    user_result := json_build_object('score', score, 'results', compared_result);
    RETURN user_result;

END
$$
    LANGUAGE plpgsql;
