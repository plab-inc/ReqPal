-- Author: Fabian, Laura

--------------------------------------------
-- Lesson related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_edit_lessons" ON public.lessons;
CREATE POLICY "policy_edit_lessons"
    ON public.lessons
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR
    auth.uid() = user_id
    );

DROP POLICY IF EXISTS "policy_lessons_example" ON public.lessons;
CREATE POLICY "policy_lessons_example"
    ON public.lessons
    FOR SELECT
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'teacher')) = true AND
    (SELECT example) = true
    );

DROP POLICY IF EXISTS "policy_select_lessons" ON public.lessons;
CREATE POLICY "policy_select_lessons"
    ON public.lessons
    FOR SELECT
    TO authenticated
    USING (
    (SELECT get_teacher_uuid(auth.uid())) = user_id AND
    published = true
    );

DROP POLICY IF EXISTS "policy_questions" ON public.questions;
CREATE POLICY "policy_questions"
    ON public.questions
    FOR SELECT
    TO authenticated
    USING (
    EXISTS(SELECT 1
           FROM lessons
           WHERE questions.lesson_uuid = lessons.uuid)
    );
DROP POLICY IF EXISTS "policy_questions_edit" ON public.questions;
CREATE POLICY "policy_questions_edit"
    ON public.questions
    FOR ALL
    TO authenticated
    USING (
    EXISTS(SELECT 1
           FROM lessons
           WHERE questions.lesson_uuid = lessons.uuid
             AND lessons.user_id = auth.uid())
    );

DROP POLICY IF EXISTS "policy_lesson_objectives" ON public.lesson_objectives;
CREATE POLICY "policy_lesson_objectives"
    ON public.lesson_objectives
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR
    ((SELECT check_user_role(auth.uid(), 'teacher')) = true AND
     auth.uid() = user_id)
    );


DROP POLICY IF EXISTS "policy_lesson_objectives_delete" ON public.lesson_objectives;
CREATE POLICY "policy_lesson_objectives_delete"
    ON public.lesson_objectives
    FOR DELETE
    TO authenticated
    USING (
    ((select check_user_role(auth.uid(), 'teacher')) = true)
        AND
    EXISTS(
        (SELECT 1
         FROM lessons
                  JOIN lesson_objectives ON lessons.uuid = lesson_objectives.lesson_id
         WHERE lessons.user_id = auth.uid())));

DROP POLICY IF EXISTS "policy_lesson_objectives_update" ON public.lesson_objectives;
CREATE POLICY "policy_lesson_objectives_update"
    ON public.lesson_objectives
    FOR UPDATE
    TO authenticated
    USING (
    ((select check_user_role(auth.uid(), 'teacher')) = true)
        AND
    EXISTS(
        (SELECT 1
         FROM lessons
                  JOIN lesson_objectives ON lessons.uuid = lesson_objectives.lesson_id
         WHERE lessons.user_id = auth.uid())));

DROP POLICY IF EXISTS "policy_lesson_objectives_insert" ON public.lesson_objectives;
CREATE POLICY "policy_lesson_objectives_insert"
    ON public.lesson_objectives
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (select check_user_role(auth.uid(), 'teacher') = true)
    );

DROP POLICY IF EXISTS "policy_select_lesson_objectives" ON public.lesson_objectives;
CREATE POLICY "policy_select_lesson_objectives"
    ON public.lesson_objectives
    FOR SELECT
    TO authenticated
    USING (true);