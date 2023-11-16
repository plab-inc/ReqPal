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
        (SELECT get_teacher_uuid(auth.uid() )) = user_id AND
        published = true
    );

DROP POLICY IF EXISTS "policy_questions" ON public.questions;
CREATE POLICY "policy_questions"
    ON public.questions
    FOR SELECT
    TO authenticated
    USING (
    EXISTS(
        SELECT 1
        FROM lessons
        WHERE questions.lesson_uuid = lessons.uuid
    )
    );
DROP POLICY IF EXISTS "policy_questions_edit" ON public.questions;
CREATE POLICY "policy_questions_edit"
    ON public.questions
    FOR ALL
    TO authenticated
    USING (
    EXISTS(
        SELECT 1
        FROM lessons
        WHERE questions.lesson_uuid = lessons.uuid AND
        lessons.user_id = auth.uid()
    )
    );