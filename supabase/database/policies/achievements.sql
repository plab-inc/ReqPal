-- Author: Laura

--------------------------------------------
-- Achievement related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_achievements" ON public.achievements;
CREATE POLICY "policy_achievements"
    ON public.achievements
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true
        OR (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true);

DROP POLICY IF EXISTS "policy_achievements_select" ON public.achievements;
CREATE POLICY "policy_achievements_select"
    ON public.achievements
    FOR SELECT
    TO authenticated
    USING (
    get_teacher_uuid(auth.uid()) = user_id
    );