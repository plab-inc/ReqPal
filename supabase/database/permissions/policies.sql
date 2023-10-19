DROP POLICY IF EXISTS "policy_profiles" ON public.profiles;
DROP POLICY IF EXISTS "policy_user_points" ON public.user_points;

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
--------------------------------------------

DROP POLICY IF EXISTS "policy_catalogs" ON public.catalogs;
CREATE POLICY "policy_catalogs"
    ON public.catalogs
    FOR ALL
    TO authenticated
    USING (
            (SELECT check_user_role(auth.uid(), 'moderator')) = true OR
            auth.uid() = user_id
    );

DROP POLICY IF EXISTS "policy_catalogs_example" ON public.catalogs;
CREATE POLICY "policy_catalogs_example"
    ON public.catalogs
    FOR SELECT
    TO authenticated
    USING (
            (SELECT check_user_role(user_id, 'moderator')) = true
    );

DROP POLICY IF EXISTS "policy_requirements" ON public.requirements;
CREATE POLICY "policy_requirements"
    ON public.requirements
    FOR ALL
    TO authenticated
    USING (
            EXISTS(
                SELECT 1
                FROM catalogs
                WHERE catalogs.catalog_id = catalog_id
            )
           );
DROP POLICY IF EXISTS "policy_product_requirements" ON public.product_requirements;
CREATE POLICY "policy_product_requirements"
    ON public.product_requirements
    FOR ALL
    TO authenticated
    USING (
    EXISTS(
        SELECT 1
        FROM requirements
        WHERE requirements.requirement_id = requirement_id
    )
    );

DROP POLICY IF EXISTS "policy_products" ON public.products;
CREATE POLICY "policy_products"
    ON public.products
    FOR SELECT
    TO authenticated
    USING ((select check_user_role(auth.uid(), 'teacher')) = true);

DROP POLICY IF EXISTS "policy_products_insert" ON public.products;
CREATE POLICY "policy_products_insert"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK ((select check_user_role(auth.uid(), 'teacher')) = true);

DROP POLICY IF EXISTS "policy_products_update" ON public.products;
CREATE POLICY "policy_products_update"
    ON public.products
    FOR UPDATE
    USING ((select check_user_role(auth.uid(), 'teacher')) = true);

--------------------------------------------
-- Lesson related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_edit_lessons" ON public.lessons;
CREATE POLICY "policy_edit_lessons"
    ON public.lessons
    FOR ALL
    TO authenticated
    USING (
            (SELECT check_user_role(auth.uid(), 'moderator')) = true OR
            auth.uid() = user_id
    );

DROP POLICY IF EXISTS "policy_select_lessons" ON public.lessons;
CREATE POLICY "policy_select_lessons"
    ON public.lessons
    FOR SELECT
    TO authenticated
    USING (
        (SELECT get_teacher_uuid(auth.uid() )) = user_id AND
        published = true
    );

DROP POLICY IF EXISTS "policy_questions" ON public.questions;
CREATE POLICY "policy_questions"
    ON public.questions
    FOR SELECT
    TO authenticated
    USING (
    EXISTS(
        SELECT 1
        FROM lessons
        WHERE questions.lesson_id = lessons.id
    )
    );
DROP POLICY IF EXISTS "policy_questions_edit" ON public.questions;
CREATE POLICY "policy_questions_edit"
    ON public.questions
    FOR ALL
    TO authenticated
    USING (
    EXISTS(
        SELECT 1
        FROM lessons
        WHERE questions.lesson_id = lessons.id AND
        lessons.user_id = auth.uid()
    )
    );