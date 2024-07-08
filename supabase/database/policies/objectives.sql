-- Author: Laura

--------------------------------------------
-- Objective related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_objectives_select" ON public.objectives;
CREATE POLICY "policy_objectives_select"
    ON public.objectives
    FOR SELECT
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR
    (auth.uid() = user_id) OR
    (get_teacher_uuid(auth.uid()) = user_id)
    );

DROP POLICY IF EXISTS "policy_objectives_delete" ON public.objectives;
CREATE POLICY "policy_objectives_delete"
    ON public.objectives
    FOR DELETE
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true
        OR
    (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true
    );

DROP POLICY IF EXISTS "policy_objectives_update" ON public.objectives;
CREATE POLICY "policy_objectives_update"
    ON public.objectives
    FOR UPDATE
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true
        OR
    (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true
    );

DROP POLICY IF EXISTS "policy_objectives_insert" ON public.objectives;
CREATE POLICY "policy_objectives_insert"
    ON public.objectives
    FOR INSERT
    TO authenticated
    WITH CHECK (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true
        OR
    (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true
    );
