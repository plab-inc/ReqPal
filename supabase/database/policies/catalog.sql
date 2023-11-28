-- Author: Fabian, Laura

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
            auth.uid() = user_id OR
            get_teacher_uuid(auth.uid() ) = user_id
    );

DROP POLICY IF EXISTS "policy_catalogs_example" ON public.catalogs;
CREATE POLICY "policy_catalogs_example"
    ON public.catalogs
    FOR SELECT
    TO authenticated
    USING (
        (SELECT example) = true
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
    USING (true);

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

DROP POLICY IF EXISTS "policy_product_catalog_insert" ON public.product_catalogs;
CREATE POLICY "policy_product_catalog_insert"
    ON public.product_catalogs
    FOR INSERT
    TO authenticated
    WITH CHECK ((select check_user_role(auth.uid(), 'teacher')) = true);

DROP POLICY IF EXISTS "policy_product_catalog_select" ON public.product_catalogs;
CREATE POLICY "policy_product_catalog_select"
    ON public.product_catalogs
    FOR SELECT
    TO authenticated
    USING (true);