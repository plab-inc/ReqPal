import { supabase } from "@/plugins/supabase";
import {
  Scenario,
  ScenarioDTO,
  ScenarioProgress,
  ScenarioProgressDTO,
  ScenarioProgressStatistic
} from "@/types/scenario.ts";
import { mapToScenario, mapToScenarioProgress } from "@/mapper/scenario.ts";
import { v4 as uuidv4 } from "uuid";
import { ScenarioUserStatisticData } from "@/types/scenarioUserStatistic.ts";
import { mapToScenarioUserStatisticData } from "@/mapper/scenarioUserStatistic.ts";
import { QuestionAnswer } from "@/types/lesson.ts";

class ScenarioServiceClass {

  public pull = {
    fetchScenarios: this.fetchScenarios.bind(this),
    fetchScenario: this.fetchScenarioById.bind(this),
    fetchScenarioProgressByScenario: this.fetchScenarioProgressByScenario.bind(this),
    fetchScenarioProgresses: this.fetchScenarioProgresses.bind(this),
    fetchScenarioUserStatistics: this.fetchScenarioUserStatistics.bind(this),
    fetchScenarioUserStatistic: this.fetchScenarioUserStatistic.bind(this),
    fetchScenarioProgressStatistics: this.fetchScenarioProgressStatistics.bind(this)
  };

  public push = {
    uploadScenario: this.uploadScenario.bind(this),
    toggleField: this.toggleField.bind(this),
    deleteScenario: this.deleteScenario.bind(this),
    createScenarioProgress: this.createScenarioProgress.bind(this),
    saveLessonAnswersInProgress: this.saveLessonAnswersInProgress.bind(this)
  };

  private async deleteScenario(scenario: Scenario): Promise<ScenarioDTO | undefined> {
    const { data, error } = await supabase
      .from("scenarios")
      .delete()
      .eq("id", scenario.id)
      .select().single();

    if (error) throw error;

    return data;
  }

  private async uploadScenario(scenario: Scenario): Promise<Scenario | undefined> {

    const { data, error } = await supabase
      .from("scenarios")
      .upsert({
        id: scenario.id,
        user_id: scenario.user,
        description: scenario.description,
        title: scenario.title,
        minLessons: scenario.minLessons,
        lessons: scenario.lessonsCount,
        achievements: scenario.achievements,
        edited: scenario.edited
      })
      .select().single();

    if (error) throw error;

    return mapToScenario(data);

  }

  private async fetchScenarios(): Promise<ScenarioDTO[] | undefined> {

    const { data, error } = await supabase
      .from("scenarios")
      .select("*");

    if (error) throw error;

    if (data) {
      return data;
    }
  }

  private async fetchScenarioById(scenarioId: string): Promise<ScenarioDTO | undefined> {

    const { data, error } = await supabase
      .from("scenarios")
      .select("*")
      .eq("id", scenarioId)
      .single();

    if (error) throw error;

    if (data) {
      return data;
    }
  }

  private async createScenarioProgress(scenario: Scenario, userId: string) {
    const { data, error } = await supabase
      .from("scenario_user_progress")
      .upsert(
        { id: uuidv4(), scenario_id: scenario.id, user_id: userId }
      )
      .select().single();

    if (error) throw error;

    if (data) {
      return mapToScenarioProgress(data as ScenarioProgressDTO, scenario);
    }
  }

  private async saveLessonAnswersInProgress(scenario: Scenario, userId: string, lessonAnswers: QuestionAnswer[]) {
    const { error } = await supabase
      .from("scenario_user_progress")
      .update(
        { lesson_answers: lessonAnswers })
      .eq("user_id", userId)
      .eq("scenario_id", scenario.id);

    if (error) throw error;
  }

  private async fetchScenarioProgressByScenario(scenario: Scenario): Promise<ScenarioProgress | undefined> {
    const { data, error } = await supabase
      .from("scenario_user_progress")
      .select("*")
      .eq("scenario_id", scenario.id)
      .single();
    if (error) throw error;

    if (data) {
      return mapToScenarioProgress(data as ScenarioProgressDTO, scenario);
    }
  }

  private async fetchScenarioProgresses(scenarios: Scenario[]): Promise<ScenarioProgress[] | undefined> {
    const scenarioIds = scenarios.map(scenario => scenario.id);

    const { data, error } = await supabase
      .from("scenario_user_progress")
      .select("*")
      .in("scenario_id", scenarioIds);

    if (error) throw error;

    if (data) {
      return data.map(item => {
        const correspondingScenario = scenarios.find(scenario => scenario.id === item.scenario_id);
        return correspondingScenario ? mapToScenarioProgress(item as ScenarioProgressDTO, correspondingScenario) : undefined;
      }).filter(item => item !== undefined) as ScenarioProgress[];
    }
  }

  private async fetchScenarioProgressStatistics(scenarioIds: string[]) {
    const { data, error } = await supabase.rpc("get_szenario_statistics", {
      szenario_ids: scenarioIds
    });

    if (error) throw error;
    if (data) return data as ScenarioProgressStatistic[];
  }

  private async toggleField(scenario: Scenario, field: "locked"): Promise<void> {
    const { error } = await supabase
      .rpc("reverse_boolean_value", {
        table_name: "scenarios",
        boolean_column_name: field,
        id_column_name: "id",
        row_id: scenario.id
      });

    if (error) throw error;
  }

  private async fetchScenarioUserStatistics(scenarios: Scenario[], userId: string): Promise<ScenarioUserStatisticData[] | undefined> {
    const scenarioIds = scenarios.map(scenario => scenario.id);

    const { data, error } = await supabase
      .from("scenario_user_statistics")
      .select("*, scenario_user_progress!inner(scenario_id, user_id)")
      .in("scenario_user_progress.scenario_id", scenarioIds)
      .eq("scenario_user_progress.user_id", userId);

    if (error) {
      console.error("Error fetching scenario user statistics:", error);
      throw error;
    }

    if (data) {
      let results: ScenarioUserStatisticData[] = [];
      data.forEach(d => {
        results.push(mapToScenarioUserStatisticData(d));
      });
      return results;
    }
  }

  private async fetchScenarioUserStatistic(scenario: Scenario, userId: string): Promise<ScenarioUserStatisticData | undefined> {

    const { data, error } = await supabase
      .from("scenario_user_statistics")
      .select("*, scenario_user_progress!inner(scenario_id, user_id)")
      .eq("scenario_user_progress.scenario_id", scenario.id)
      .eq("scenario_user_progress.user_id", userId)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return mapToScenarioUserStatisticData(data);
    }
  }
}

const ScenarioService = new ScenarioServiceClass();

export default ScenarioService;