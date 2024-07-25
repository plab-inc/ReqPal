-- Author: Laura

--------------------------------------------
-- Teacher requests related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_teacher_requests_insert" ON public.teacher_requests;
CREATE POLICY policy_teacher_requests_insert
    ON public.teacher_requests
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "policy_teacher_requests" ON public.teacher_requests;
CREATE POLICY "policy_teacher_requests"
    ON public.teacher_requests
    FOR ALL
    TO authenticated
    USING (
    (select is_claims_admin() = true));