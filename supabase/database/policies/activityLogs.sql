-- Author: Laura

--------------------------------------------
-- Xp Activity Logs related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_xp_activity_logs_levels" ON public.xp_activity_logs;
CREATE POLICY "policy_user_levels"
    ON public.xp_activity_logs
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (auth.uid() = user_id));