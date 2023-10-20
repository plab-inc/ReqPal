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

create or replace function get_lesson_json(p_lesson_id integer) returns jsonb
    language plpgsql
as
$$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
                   'id', l.id,
                   'title', l.title,
                   'description', l.description,
                   'points', l.points,
                   'questions', COALESCE(
                           jsonb_agg(
                                   jsonb_build_object(
                                           'hint', q.hint,
                                           'id', q.id,
                                           'lesson_id', q.lesson_id,
                                           'options', q.options,
                                           'position', q.position,
                                           'question', q.question,
                                           'type', q.question_type,
                                           'solution', q.solution
                                       )
                                   ORDER BY q.position),'[]'::jsonb))
    INTO result
    FROM lessons l
             LEFT JOIN questions q ON l.id = q.lesson_id
    WHERE l.id = p_lesson_id
    GROUP BY l.id;

    RETURN result;
END;
$$;