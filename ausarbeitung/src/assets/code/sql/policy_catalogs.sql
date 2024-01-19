DROP POLICY IF EXISTS "policy_catalogs" ON public.catalogs;
CREATE POLICY "policy_catalogs"
    ON public.catalogs
    FOR ALL
    TO authenticated
    USING (
            (SELECT check_user_role(auth.uid(), 'moderator')) = true OR
            auth.uid() = user_id OR
            get_teacher_uuid(auth.uid() ) = user_id
    );