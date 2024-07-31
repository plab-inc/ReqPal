-- Author: Laura

--------------------------------------------
-- Scenario_user_statistics related policies
--------------------------------------------

DROP POLICY IF EXISTS "policy_scenario_user_statistics_select" ON public.scenario_user_statistics;

CREATE POLICY "policy_scenario_user_statistics_select"
    ON public.scenario_user_statistics
    FOR SELECT
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR
    (SELECT check_user_role(auth.uid(), 'teacher')) OR
    (EXISTS (
        SELECT 1
        FROM public.scenario_user_progress
        WHERE scenario_user_progress.user_id = auth.uid() AND
            scenario_user_progress.id = scenario_user_statistics.scenario_user_progress_id
    ))
    );

DROP POLICY IF EXISTS "policy_scenario_user_statistics" ON public.scenario_user_statistics;

CREATE POLICY "policy_scenario_user_statistics"
    ON public.scenario_user_statistics
    FOR ALL
    TO authenticated
    USING (
    (SELECT check_user_role(auth.uid(), 'moderator')) = true OR
    (EXISTS (
        SELECT 1
        FROM public.scenario_user_progress
        WHERE scenario_user_progress.user_id = auth.uid() AND
            scenario_user_progress.id = scenario_user_statistics.scenario_user_progress_id
    ))
    );
