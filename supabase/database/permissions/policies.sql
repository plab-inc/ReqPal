DROP POLICY IF EXISTS "policy_profiles" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_auth" ON public.profiles;
DROP POLICY IF EXISTS "policy_profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "policy_user_answers" ON public.user_answers;
DROP POLICY IF EXISTS "policy_user_points" ON public.user_points;
DROP POLICY IF EXISTS "policy_user_lesson_progress" ON public.user_lesson_progress;
DROP POLICY IF EXISTS "policy_user_hints" ON public.user_hints;
DROP POLICY IF EXISTS "policy_user_finished_lessons" ON public.user_finished_lessons;
DROP POLICY IF EXISTS "policy_user_finished_lessons_teacher" ON public.user_finished_lessons;

--------------------------------------------
-- User related policies
--------------------------------------------
CREATE POLICY policy_feedback
    ON public.user_feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY policy_feedback_select
    ON public.user_feedback
    FOR SELECT
    TO authenticated
    USING ((auth.uid() = user_id));

CREATE POLICY policy_profiles
    ON public.profiles
    FOR SELECT
    TO PUBLIC
    USING (role = 'teacher');

CREATE POLICY policy_profiles_auth
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY policy_profiles_update
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "policy_user_points"
    ON public.user_points
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

CREATE POLICY "policy_user_answers"
    ON public.user_answers
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

CREATE POLICY "policy_user_lesson_progress"
    ON public.user_lesson_progress
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

CREATE POLICY "policy_user_hints"
    ON public.user_hints
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

CREATE POLICY "policy_user_finished_lessons"
    ON public.user_finished_lessons
    FOR ALL
    TO authenticated
    USING (((select check_user_role(auth.uid(), 'student')) = true) AND (auth.uid() = user_id));

CREATE POLICY "policy_user_finished_lessons_teacher"
    ON public.user_finished_lessons
    FOR SELECT
    TO authenticated
    USING (
        ((select check_user_role(auth.uid(), 'teacher')) = true) AND
        (EXISTS (
            SELECT COUNT(*)
            FROM public.profiles
            WHERE teacher = auth.uid()
            HAVING COUNT(*) >= 10))
    );

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

DROP POLICY IF EXISTS "policy_lessons_example" ON public.lessons;
CREATE POLICY "policy_lessons_example"
    ON public.lessons
    FOR SELECT
    TO authenticated
    USING (
        (SELECT check_user_role(auth.uid(), 'teacher')) = true AND
        (SELECT example) = true
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
        WHERE questions.lesson_uuid = lessons.uuid
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
        WHERE questions.lesson_uuid = lessons.uuid AND
        lessons.user_id = auth.uid()
    )
    );