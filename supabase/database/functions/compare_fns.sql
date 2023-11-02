--- wurden durch result_fns ersetzt
DROP FUNCTION IF EXISTS mc_compare_solution(INTEGER, JSON);
DROP FUNCTION IF EXISTS sortable_compare_solution(INTEGER, JSON);
DROP FUNCTION IF EXISTS true_false_compare_solution(INTEGER, BOOLEAN);

CREATE FUNCTION mc_compare_solution(question_id INTEGER, answer_json JSON) RETURNS JSON
    LANGUAGE plpgsql
AS $$
DECLARE
    question_json JSON;
    result_json JSON;
BEGIN
    SELECT answers::JSON INTO question_json FROM questions WHERE id = question_id;

    SELECT json_build_object(
                   'wholeAnswerIsCorrect', NOT bool_or(result_item ->> 'answerIsCorrect' = 'false'),
                   'results', json_agg(result_item)
               )
    INTO result_json
    FROM (
             SELECT json_build_object(
                            'id', q_option->>'id',
                            'answerIsCorrect', (q_option->>'solution')::BOOLEAN = (o_option->>'solution')::BOOLEAN
                        ) AS result_item
             FROM json_array_elements(question_json::JSON) AS q_option
                      LEFT JOIN json_array_elements(answer_json::JSON) AS o_option ON (q_option->>'id')::INT = (o_option->>'id')::INT
         ) AS result_items;

    RETURN result_json;
END;
$$;

CREATE FUNCTION sortable_compare_solution(question_id INTEGER, answer_json JSON) RETURNS JSON
    LANGUAGE plpgsql
AS $$
DECLARE
    question_json JSON;
    result_json JSON;
BEGIN
    SELECT answers::JSON INTO question_json FROM questions WHERE "id" = question_id;

    SELECT json_build_object(
                   'wholeAnswerIsCorrect', NOT bool_or(result_item ->> 'answerIsCorrect' = 'false'),
                   'results', json_agg(result_item)
               )
    INTO result_json
    FROM (
             SELECT json_build_object(
                            'id', q_option->>'id',
                            'answerIsCorrect', (q_option->>'order')::INT = (o_option->>'order')::INT
                        ) AS result_item
             FROM json_array_elements(question_json::JSON) AS q_option
                      LEFT JOIN json_array_elements(answer_json::JSON) AS o_option ON (q_option->>'id')::INT = (o_option->>'id')::INT
         ) AS result_items;

    RETURN result_json;
END;
$$;

CREATE FUNCTION true_false_compare_solution(question_id INTEGER, user_result BOOLEAN) RETURNS JSON
    LANGUAGE plpgsql
AS $$
DECLARE
    correctResult BOOLEAN := false;
    result_json JSON;
BEGIN
    SELECT (answers->>'solution')::BOOLEAN INTO correctResult
    FROM questions
    WHERE id = question_id;

    result_json := json_build_object(
            'wholeAnswerIsCorrect', (user_result = correctResult)::BOOLEAN,
            'results', json_agg(
                    json_build_object(
                            'id', CASE WHEN correctResult = true THEN 'true' ELSE 'false' END,
                            'answerIsCorrect', user_result = correctResult
                        )
                )
        );

    RETURN result_json;
END;
$$;