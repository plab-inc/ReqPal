-- Author: Laura

--------------------------------------------
-- Learning goals related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_learning_goals_select" ON public.learning_goals;
CREATE POLICY "policy_learning_goals_select"
    ON public.learning_goals
    FOR SELECT
    TO authenticated
    USING (
   (auth.uid() = user_id) OR
    (get_teacher_uuid(auth.uid()) = user_id)
    );

    DROP POLICY IF EXISTS "policy_learning_goals_delete" ON public.learning_goals;
    CREATE POLICY "policy_learning_goals_delete"
        ON public.learning_goals
        FOR DELETE
        TO authenticated
        USING (
        (SELECT check_user_role(auth.uid(), 'moderator')) = true
            OR
        (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true
        );

    DROP POLICY IF EXISTS "policy_learning_goals_update" ON public.learning_goals;
    CREATE POLICY "policy_learning_goals_update"
        ON public.learning_goals
        FOR UPDATE
        TO authenticated
        USING (
        (SELECT check_user_role(auth.uid(), 'moderator')) = true
            OR
        (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true
        );

    DROP POLICY IF EXISTS "policy_learning_goals_insert" ON public.learning_goals;
    CREATE POLICY "policy_learning_goals_insert"
        ON public.learning_goals
        FOR INSERT
        TO authenticated
        WITH CHECK (
        (SELECT check_user_role(auth.uid(), 'moderator')) = true
            OR
        (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true AND (
            EXISTS (SELECT COUNT(*)
                    FROM public.learning_goals
                    WHERE user_id = auth.uid()
                    HAVING COUNT(*) < 5)
            )
        );