-- Author: Laura

--------------------------------------------
-- Achievement, ReqPal Achievement user_achievement related policies
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

DROP POLICY IF EXISTS "policy_user_achievements_select" ON public.user_achievements;
CREATE POLICY "policy_user_achievements_select"
    ON public.user_achievements
    FOR SELECT
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (SELECT check_user_role(auth.uid(), 'teacher')) OR
    (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_achievements" ON public.user_achievements;
CREATE POLICY "policy_user_achievements"
    ON public.user_achievements
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (auth.uid() = user_id));


DROP POLICY IF EXISTS "policy_reqpal_achievements_select" ON public.reqpal_achievements;
CREATE POLICY "policy_reqpal_achievements_select"
    ON public.reqpal_achievements
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "policy_reqpal_achievements" ON public.reqpal_achievements;
CREATE POLICY "policy_reqpal_achievements"
    ON public.reqpal_achievements
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true);

DROP POLICY IF EXISTS "policy_reqpal_achievement_levels_select" ON public.reqpal_achievement_levels;
CREATE POLICY "policy_reqpal_achievement_levels_select"
    ON public.reqpal_achievement_levels
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "policy_reqpal_achievement_levels" ON public.reqpal_achievement_levels;
CREATE POLICY "policy_reqpal_achievement_levels"
    ON public.reqpal_achievement_levels
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true);

DROP POLICY IF EXISTS "policy_user_reqpal_achievements_select" ON public.user_reqpal_achievements;
CREATE POLICY "policy_user_reqpal_achievements_select"
    ON public.user_reqpal_achievements
    FOR SELECT
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (SELECT check_user_role(auth.uid(), 'teacher')) OR
    (auth.uid() = user_id));

DROP POLICY IF EXISTS "policy_user_reqpal_achievements" ON public.user_reqpal_achievements;
CREATE POLICY "policy_user_reqpal_achievements"
    ON public.user_reqpal_achievements
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR (auth.uid() = user_id));