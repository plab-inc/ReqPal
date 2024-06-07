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
    (SELECT check_user_role(auth.uid(), 'moderator')) = true
        OR
    (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true
    );

DROP POLICY IF EXISTS "policy_catalogs_select" ON public.catalogs;
CREATE POLICY "policy_catalogs_select"
    ON public.catalogs
    FOR SELECT
    TO authenticated
    USING (
    get_teacher_uuid(auth.uid()) = user_id
    );

DROP POLICY IF EXISTS "policy_catalogs_example" ON public.catalogs;
CREATE POLICY "policy_catalogs_example"
    ON public.catalogs
    FOR SELECT
    TO authenticated
    USING (
        (SELECT example) = true
    );

DROP POLICY IF EXISTS "policy_requirements_select" ON public.requirements;
CREATE POLICY "policy_requirements_select"
    ON public.requirements
    FOR SELECT
    TO authenticated
    USING (
    EXISTS(SELECT 1
           FROM catalogs
           WHERE catalogs.catalog_id = catalog_id)
        AND (
        EXISTS(SELECT 1
               FROM catalogs
               WHERE catalogs.catalog_id = catalog_id
                 and catalogs.example = true)
            OR
        EXISTS(SELECT 1
               FROM catalogs
               WHERE catalogs.catalog_id = catalog_id
                 and (get_teacher_uuid(auth.uid()) = catalogs.user_id))
        )
    );

DROP POLICY IF EXISTS "policy_requirements" ON public.requirements;
CREATE POLICY "policy_requirements"
    ON public.requirements
    FOR ALL
    TO authenticated
    USING (
    EXISTS(SELECT 1
           FROM catalogs
           WHERE catalogs.catalog_id = catalog_id)
        AND
    (
        (SELECT check_user_role(auth.uid(), 'moderator')) = true
            OR (
            (SELECT check_user_role(auth.uid(), 'teacher'))
                AND
            EXISTS(SELECT 1
                   FROM catalogs
                   WHERE catalogs.catalog_id = catalog_id
                     and auth.uid() = catalogs.user_id)
            ))
    );

DROP POLICY IF EXISTS "policy_product_requirements_select" ON public.product_requirements;
CREATE POLICY "policy_product_requirements_select"
    ON public.product_requirements
    FOR SELECT
    TO authenticated
    USING (
    EXISTS(SELECT 1
           FROM requirements
           WHERE requirements.requirement_id = product_requirements.requirement_id));

DROP POLICY IF EXISTS "policy_product_requirements" ON public.product_requirements;
CREATE POLICY "policy_product_requirements"
    ON public.product_requirements
    FOR ALL
    TO authenticated
    USING (
    EXISTS(SELECT 1
           FROM requirements
           WHERE requirements.requirement_id = requirement_id)
    );

DROP POLICY IF EXISTS "policy_products_select" ON public.products;
CREATE POLICY "policy_products_select"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "policy_products_delete" ON public.products;
CREATE POLICY "policy_products_delete"
    ON public.products
    FOR DELETE
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true
        OR
    (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true
    );

DROP POLICY IF EXISTS "policy_products_update" ON public.products;
CREATE POLICY "policy_products_update"
    ON public.products
    FOR UPDATE
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true
        OR
    (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true
    );

DROP POLICY IF EXISTS "policy_products_insert" ON public.products;
CREATE POLICY "policy_products_insert"
    ON public.products
    FOR INSERT
    TO authenticated
    WITH CHECK (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true
        OR
    (auth.uid() = user_id AND (SELECT check_user_role(auth.uid(), 'teacher'))) = true AND (
        EXISTS (SELECT COUNT(*)
                FROM public.products
                WHERE user_id = auth.uid()
                HAVING COUNT(*) < 10)
        )
    );

DROP POLICY IF EXISTS "policy_product_catalogs_insert" ON public.product_catalogs;
CREATE POLICY "policy_product_catalogs_insert"
    ON public.product_catalogs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        (select check_user_role(auth.uid(), 'teacher') = true)
    );

DROP POLICY IF EXISTS "policy_product_catalogs_delete" ON public.product_catalogs;
CREATE POLICY "policy_product_catalogs_delete"
    ON public.product_catalogs
    FOR DELETE
    TO authenticated
    USING (
    ((select check_user_role(auth.uid(), 'teacher')) = true)
        AND
    EXISTS(
        (SELECT 1
         FROM catalogs
                  JOIN product_catalogs ON catalogs.catalog_id = product_catalogs.catalog_id
         WHERE catalogs.user_id = auth.uid())));

DROP POLICY IF EXISTS "policy_product_catalogs_select" ON public.product_catalogs;
CREATE POLICY "policy_product_catalogs_select"
    ON public.product_catalogs
    FOR SELECT
    TO authenticated
    USING (true);