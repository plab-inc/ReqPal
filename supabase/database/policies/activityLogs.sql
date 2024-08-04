-- Author: Laura

--------------------------------------------
-- Xp Activity Logs related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_xp_activity_logs" ON public.xp_activity_logs;
CREATE POLICY "policy_xp_activity_logs"
    ON public.xp_activity_logs
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_xp_activity_logs_select" ON public.xp_activity_logs;
CREATE POLICY "policy_xp_activity_logs_select"
    ON public.xp_activity_logs
    FOR SELECT
    TO authenticated
    USING (
    (auth.uid() = user_id));