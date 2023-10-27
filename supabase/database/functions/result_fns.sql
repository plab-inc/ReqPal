DROP FUNCTION IF EXISTS create_user_answers_from_json(jsonb);
CREATE
    OR REPLACE FUNCTION create_user_answers_from_json(data jsonb)
    RETURNS VOID AS
$$
DECLARE
    lesson_uuid         uuid;
    newAnswer           jsonb;
    question_uuid       uuid;
    lesson_finished     bool             := false;
    lesson_started    bool             := false;
    max_points          double precision := 0;
    points_per_question double precision := 0;
BEGIN
    lesson_uuid := data ->> 'uuid';

    SELECT is_started
    INTO lesson_started
    FROM user_finished_lessons
    WHERE lesson_id = lesson_uuid
      AND user_id = auth.uid();

    IF NOT FOUND THEN
        lesson_started := TRUE;
    end if;

    SELECT finished
    INTO lesson_finished
    FROM user_finished_lessons
    WHERE lesson_id = lesson_uuid
      AND user_id = auth.uid();

    IF NOT FOUND THEN
        SELECT lessons.points
        INTO max_points
        FROM lessons
        WHERE uuid = lesson_uuid;

        points_per_question := max_points / jsonb_array_length(data -> 'answers');

        INSERT INTO user_finished_lessons (user_id, lesson_id, finished, is_started, finished_for_first_time)
        VALUES (auth.uid(), lesson_uuid, TRUE, FALSE, TRUE);
        lesson_finished
            := FALSE;
    END IF;

    IF (NOT lesson_finished) THEN
        FOR newAnswer IN
            SELECT *
            FROM jsonb_array_elements(data -> 'answers')
            LOOP
                question_uuid := (newAnswer ->> 'uuid')::uuid;
                INSERT INTO user_answers (user_id, lesson_id, question_id, answer, max_points)
                VALUES (auth.uid(), lesson_uuid, question_uuid, newAnswer -> 'options', points_per_question);

            END LOOP;

    ELSE IF(lesson_started) THEN
        FOR newAnswer IN
            SELECT *
            FROM jsonb_array_elements(data -> 'answers')
            LOOP
                question_uuid := (newAnswer ->> 'uuid')::uuid;
                UPDATE user_answers
                SET answer = newAnswer -> 'options'
                WHERE lesson_id = lesson_uuid
                  AND user_id = auth.uid()
                  AND question_id = question_uuid;
            END LOOP;

        UPDATE user_finished_lessons
        SET finished  = TRUE,
            is_started = FALSE,
            finished_for_first_time = FALSE
        WHERE lesson_id = lesson_uuid
          AND user_id = auth.uid();
    END IF;
    END IF;
END;
$$
    LANGUAGE plpgsql;

--------------------------------------------
-- EVALUATION FUNCTIONS
--------------------------------------------

--------------------------------------------
-- TRUE OR FALSE
--------------------------------------------
DROP FUNCTION IF EXISTS evaluate_true_or_false(uuid, jsonb, double precision);

CREATE
    OR REPLACE FUNCTION evaluate_true_or_false(question_id uuid, answer jsonb, max_points double precision) RETURNS jsonb
AS
$$
DECLARE
    solution        jsonb;
    compared_result bool;
    score           double precision := 0;
BEGIN

    SELECT questions.solution
    INTO solution
    FROM questions
    WHERE questions.uuid = question_id;

    compared_result := (solution = answer);

    IF
        (compared_result) THEN
        score := max_points;
    END IF;

    return jsonb_build_object('isCorrect', compared_result, 'score', score);

END;
$$
    LANGUAGE plpgsql;

--------------------------------------------
-- MULTIPLE CHOICE
--------------------------------------------

DROP FUNCTION IF EXISTS evaluate_multiple_choice(uuid, jsonb, double precision);

CREATE
    OR REPLACE FUNCTION evaluate_multiple_choice(question_id uuid, answer jsonb, max_points double precision) RETURNS jsonb
AS
$$
DECLARE
    solution        jsonb;
    compared_result jsonb;
    user_result     jsonb;
    score           double precision := 0;
    percentage      double precision := 1.0;
    correctAnswers  double precision := 0;
    totalAnswers    double precision := 0;
    result          jsonb;
BEGIN

    SELECT questions.solution
    INTO solution
    FROM questions
    WHERE questions.uuid = question_id;

    compared_result := json_agg(jsonb_build_object(
            'id', q_option ->> 'id',
            'isCorrect', (q_option ->> 'solution')::BOOLEAN = (o_option ->> 'input')::BOOLEAN
                                ))
                       FROM json_array_elements(solution::JSON) AS q_option
                                LEFT JOIN json_array_elements(answer::JSON) AS o_option
                                          ON (q_option ->> 'id')::int = (o_option ->> 'id')::int;

    FOR result IN SELECT * FROM jsonb_array_elements(compared_result)
        LOOP
            IF (result ->> 'isCorrect')::BOOLEAN THEN
                correctAnswers := correctAnswers + 1;
            END IF;
        END LOOP;

    totalAnswers := jsonb_array_length(answer);
    percentage := correctAnswers / totalAnswers;
    score := max_points * percentage;

    user_result := json_build_object('score', score, 'results', compared_result);
    RETURN user_result;

END
$$
    LANGUAGE plpgsql;

--------------------------------------------
-- SLIDER
--------------------------------------------

DROP FUNCTION IF EXISTS evaluate_slider(uuid, jsonb, double precision);

CREATE
    OR REPLACE FUNCTION evaluate_slider(question_id uuid, answer jsonb, max_points double precision) RETURNS jsonb
AS
$$
DECLARE
    solution        jsonb;
    right_answer    integer;
    tolerance_value integer;
    user_input      integer;
    score           double precision := 0;
    is_correct      bool             := false;
BEGIN

    SELECT questions.solution
    INTO solution
    FROM questions
    WHERE questions.uuid = question_id;

    user_input := answer ->> 'input';
    right_answer := solution ->> 'correctValue';
    tolerance_value := solution ->> 'toleranceValue';

    IF (user_input <= right_answer + tolerance_value) AND (user_input >= right_answer - tolerance_value) THEN
        score := max_points;
        is_correct := true;
    END IF;

    RETURN json_build_object('score', score, 'isCorrect', is_correct);
END
$$
    LANGUAGE plpgsql;
