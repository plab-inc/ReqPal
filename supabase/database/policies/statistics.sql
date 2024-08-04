-- Author: Laura

--------------------------------------------
-- User_Statistics related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_user_statistics_select" ON public.user_statistics;
CREATE POLICY "policy_user_statistics_select"
    ON public.user_statistics
    FOR SELECT
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (SELECT check_user_role(auth.uid(), 'teacher')) OR
    (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_statistics" ON public.user_statistics;
CREATE POLICY "policy_user_statistics"
    ON public.user_statistics
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (auth.uid() = user_id));