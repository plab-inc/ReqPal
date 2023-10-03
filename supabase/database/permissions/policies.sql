DROP POLICY IF EXISTS "policy_profiles" ON public.profiles;
DROP POLICY IF EXISTS "policy_user_points" ON public.user_points;
DROP POLICY IF EXISTS "policy_catalogs" ON public.catalogs;
DROP POLICY IF EXISTS "policy_products" ON public.products;
DROP POLICY IF EXISTS "policy_requirements" ON public.requirements;
DROP POLICY IF EXISTS "policy_product_requirements" ON public.product_requirements;
DROP POLICY IF EXISTS "policy_lessons" ON public.lessons;
DROP POLICY IF EXISTS "policy_questions" ON public.questions;
DROP POLICY IF EXISTS "policy_questions_teacher" ON public.questions;


--------------------------------------------
-- User related policies
--------------------------------------------

CREATE POLICY "policy_profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "policy_user_points"
    ON public.user_points
    FOR SELECT
    TO authenticated
    USING (true);

--------------------------------------------
-- Catalog related policies
-- TODO: Teacher can edit/view all catalogs rn, should be only their own -> Change DB Model
--------------------------------------------

CREATE POLICY "policy_catalogs"
    ON public.catalogs
    FOR ALL
    TO authenticated
    USING ((select check_user_role(auth.uid(), 'teacher')) = true);

CREATE POLICY "policy_products"
    ON public.products
    FOR ALL
    TO authenticated
    USING ((select check_user_role(auth.uid(), 'teacher')) = true);

CREATE POLICY "policy_requirements"
    ON public.requirements
    FOR ALL
    TO authenticated
    USING ((select check_user_role(auth.uid(), 'teacher')) = true);

CREATE POLICY "policy_product_requirements"
    ON public.product_requirements
    FOR ALL
    TO authenticated
    USING ((select check_user_role(auth.uid(), 'teacher')) = true);

--------------------------------------------
-- Lesson related policies
--------------------------------------------

CREATE POLICY "policy_lessons"
    ON public.lessons
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "policy_questions"
    ON public.questions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "policy_questions_teacher"
    ON public.questions
    FOR ALL
    TO authenticated
    USING ((select check_user_role(auth.uid(), 'teacher')) = true);