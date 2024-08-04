-- Author: Laura

--------------------------------------------
-- User_Levels related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_user_levels_select" ON public.user_levels;
CREATE POLICY "policy_user_levels_select"
    ON public.user_levels
    FOR SELECT
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (SELECT check_user_role(auth.uid(), 'teacher')) OR
    (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_levels" ON public.user_levels;
CREATE POLICY "policy_user_levels"
    ON public.user_levels
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_reqpal_levels_select" ON public.user_reqpal_levels;
CREATE POLICY "policy_user_reqpal_levels_select"
    ON public.user_reqpal_levels
    FOR SELECT
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (SELECT check_user_role(auth.uid(), 'teacher')) OR
    (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_reqpal_levels" ON public.user_reqpal_levels;
CREATE POLICY "policy_user_reqpal_levels"
    ON public.user_reqpal_levels
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (auth.uid() = user_id));