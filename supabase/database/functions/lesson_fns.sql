CREATE OR REPLACE FUNCTION create_lesson_from_json(data jsonb)
    RETURNS VOID AS
$$
DECLARE
    lesson_id bigint;
    question  jsonb;
BEGIN
    INSERT INTO lessons (title, description, points, teacher_id, published)
    VALUES (data ->> 'title',
            data ->> 'description',
            COALESCE(CAST(data ->> 'points' AS integer), 0),
            auth.uid(),
            false)
    RETURNING id INTO lesson_id;

    FOR question IN SELECT * FROM jsonb_array_elements(data -> 'questions')
        LOOP
            INSERT INTO questions (question,
                                   lesson_id,
                                   solution,
                                   hint,
                                   question_type,
                                   options,
                                   position)
            VALUES (question ->> 'question',
                    lesson_id,
                    question -> 'solution',
                    question ->> 'hint',
                    question ->> 'type',
                    question -> 'options',
                    COALESCE(CAST(question ->> 'position' AS integer), 0));
        END LOOP;
END;
$$ LANGUAGE plpgsql;