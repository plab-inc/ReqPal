-- Author: Fabian, Laura

create or replace function create_lesson_from_json(data jsonb) returns void
    language plpgsql
as
$$
DECLARE
    v_lesson_uuid uuid;
    question      jsonb;
    total_points  int4 := 0;
BEGIN
    INSERT INTO lessons (uuid, title, description, user_id, published, learning_goal)
    VALUES ((data ->> 'uuid')::uuid,
            data ->> 'title',
            data ->> 'description',
            auth.uid(),
            false,
            (data ->> 'learningGoalId')::uuid)
    ON CONFLICT (uuid) DO UPDATE
        SET title       = EXCLUDED.title,
            description = EXCLUDED.description,
            user_id     = EXCLUDED.user_id,
            learning_goal = EXCLUDED.learning_goal
    RETURNING uuid INTO v_lesson_uuid;

--Löscht alle Fragen, aus der Lesson. On conflict ist nun nutzlos, aber wurde mir zu umständlich, zu überprüfen, ob Fragen gelöscht wurden. FT
    DELETE FROM questions WHERE lesson_uuid = v_lesson_uuid;

    FOR question IN SELECT * FROM jsonb_array_elements(data -> 'questions')
        LOOP
            INSERT INTO questions (uuid,
                                   question,
                                   lesson_uuid,
                                   solution,
                                   hint,
                                   question_type,
                                   options,
                                   position,
                                   points)
            VALUES ((question ->> 'uuid')::uuid,
                    question ->> 'question',
                    v_lesson_uuid,
                    question -> 'solution',
                    question ->> 'hint',
                    question ->> 'type',
                    question -> 'options',
                    COALESCE(CAST(question ->> 'position' AS integer), 0),
                    COALESCE(CAST(question ->> 'points' AS integer), 0))
            ON CONFLICT (uuid) DO UPDATE
                SET question      = EXCLUDED.question,
                    lesson_uuid   = EXCLUDED.lesson_uuid,
                    solution      = EXCLUDED.solution,
                    hint          = EXCLUDED.hint,
                    question_type = EXCLUDED.question_type,
                    options       = EXCLUDED.options,
                    position      = EXCLUDED.position,
                    points        = EXCLUDED.points;

            total_points := total_points + COALESCE(CAST(question ->> 'points' AS integer), 0);
        END LOOP;

    UPDATE lessons
    SET points = total_points
    WHERE uuid = v_lesson_uuid;
END;
$$;

create or replace function get_lesson_json(p_lesson_uuid uuid) returns jsonb
    language plpgsql
as
$$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
                   'uuid', l.uuid,
                   'title', l.title,
                   'description', l.description,
                   'learningGoalId', l.learning_goal,
                   'questions', COALESCE(
                           jsonb_agg(
                                   jsonb_build_object(
                                           'hint', q.hint,
                                           'uuid', q.uuid,
                                           'lesson_uuid', q.lesson_uuid,
                                           'options', q.options,
                                           'position', q.position,
                                           'question', q.question,
                                           'type', q.question_type,
                                           'solution', q.solution,
                                           'points', q.points
                                   )
                                   ORDER BY q.position), '[]'::jsonb))
    INTO result
    FROM lessons l
             LEFT JOIN questions q ON l.uuid = q.lesson_uuid
    WHERE l.uuid = p_lesson_uuid
    GROUP BY l.uuid;

    RETURN result;
END;
$$;

create or replace function reverse_boolean_value(row_uuid uuid) returns void
    language plpgsql
as
$$
BEGIN
    UPDATE lessons
    SET published = NOT published
    WHERE uuid = row_uuid;
END;
$$;