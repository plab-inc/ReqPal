-- Author: Fabian, Laura

--------------------------------------------
-- User related policies
--------------------------------------------
DROP POLICY IF EXISTS "policy_feedback" ON public.user_feedback;
CREATE POLICY policy_feedback
    ON public.user_feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "policy_feedback_select" ON public.user_feedback;
CREATE POLICY policy_feedback_select
    ON public.user_feedback
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_profiles" ON public.profiles;
CREATE POLICY policy_profiles
    ON public.profiles
    FOR SELECT
    TO PUBLIC
    USING (true);

DROP POLICY IF EXISTS "policy_profiles_auth" ON public.profiles;
CREATE POLICY policy_profiles_auth
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "policy_profiles_update" ON public.profiles;
CREATE POLICY policy_profiles_update
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "policy_user_points" ON public.user_points;
CREATE POLICY "policy_user_points"
    ON public.user_points
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_answers" ON public.user_answers;
CREATE POLICY "policy_user_answers"
    ON public.user_answers
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_lesson_progress" ON public.user_lesson_progress;
CREATE POLICY "policy_user_lesson_progress"
    ON public.user_lesson_progress
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_hints" ON public.user_hints;
CREATE POLICY "policy_user_hints"
    ON public.user_hints
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_finished_lessons" ON public.user_finished_lessons;
CREATE POLICY "policy_user_finished_lessons"
    ON public.user_finished_lessons
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_finished_lessons_teacher" ON public.user_finished_lessons;
     --for testing purpose count is >= 1 instead of >= 10
CREATE POLICY "policy_user_finished_lessons_teacher"
    ON public.user_finished_lessons
    FOR SELECT
    TO authenticated
    USING (
        ((select check_user_role(auth.uid(), 'teacher')) = true) AND
        (EXISTS (
            SELECT COUNT(*)
            FROM public.profiles
            WHERE teacher = auth.uid()
            HAVING COUNT(*) >= 1))
    );