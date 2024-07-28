import { supabase } from "@/plugins/supabase";
import { Scenario, ScenarioDTO, ScenarioProgress, ScenarioUserDTO } from "@/types/scenario.ts";
import { mapToScenario, mapToScenarioProgress } from "@/mapper/scenario.ts";

class ScenarioServiceClass {

  public pull = {
    fetchScenarios: this.fetchScenarios.bind(this),
    fetchScenario: this.fetchScenarioById.bind(this),
    fetchScenarioProgressByScenario: this.fetchScenarioProgressByScenario.bind(this),
    fetchScenarioProgresses: this.fetchScenarioProgresses.bind(this)
  };

  public push = {
    uploadScenario: this.uploadScenario.bind(this),
    toggleField: this.toggleField.bind(this),
    deleteScenario: this.deleteScenario.bind(this),
    createScenarioProgress: this.createScenarioProgress.bind(this)
  }


  private async deleteScenario(scenario: Scenario): Promise<ScenarioDTO | undefined> {
    const {data, error} = await supabase
      .from('scenarios')
      .delete()
      .eq('id', scenario.id)
      .select().single();

    if (error) throw error;

    return data;
  }

  private async uploadScenario(scenario: Scenario): Promise<Scenario | undefined> {

    const { data, error } = await supabase
      .from('scenarios')
      .upsert({
        id: scenario.id,
        user_id: scenario.user,
        description: scenario.description,
        title: scenario.title,
        minLessons: scenario.minLessons,
        lessons: scenario.lessonsCount,
        achievements: scenario.achievements
      })
      .select().single()

    if (error) throw error;

    return mapToScenario(data)

  }

  private async fetchScenarios(): Promise<ScenarioDTO[] | undefined> {

    const {data, error} = await supabase
      .from('scenarios')
      .select('*')

    if (error) throw error;

    if (data) {
      return data;
    }
  }

  private async fetchScenarioById(scenarioId: string): Promise<ScenarioDTO | undefined> {

    const {data, error} = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single()

    if (error) throw error;

    if (data) {
      return data;
    }
  }

  private async createScenarioProgress(scenario: Scenario, userId: string) {
    const { data, error } = await supabase
      .from("user_scenario")
      .insert(
        { scenario_id: scenario.id, user_id: userId }
      )
      .select().single();

    if (error) throw error;

    if (data) {
      return mapToScenarioProgress(data as ScenarioUserDTO, scenario);
    }
  }


  private async fetchScenarioProgressByScenario(scenario: Scenario): Promise<ScenarioProgress | undefined> {

    const { data, error } = await supabase
      .from("user_scenario")
      .select("*")
      .eq("scenario_id", scenario.id)
      .single();

    if (error) throw error;

    if (data) {
      return mapToScenarioProgress(data as ScenarioUserDTO, scenario);
    }
  }

  private async fetchScenarioProgresses(scenarios: Scenario[]): Promise<ScenarioProgress[] | undefined> {
    const scenarioIds = scenarios.map(scenario => scenario.id);

    const { data, error } = await supabase
      .from("user_scenario")
      .select("*")
      .in("scenario_id", scenarioIds);

    if (error) throw error;

    if (data) {
      return data.map(item => {
        const correspondingScenario = scenarios.find(scenario => scenario.id === item.scenario_id);
        return correspondingScenario ? mapToScenarioProgress(item as ScenarioUserDTO, correspondingScenario) : undefined;
      }).filter(item => item !== undefined) as ScenarioProgress[];
    }
  }

  private async toggleField(scenario: Scenario, field: 'locked' | 'deployed'): Promise<void> {
    const {error} = await supabase
      .rpc('reverse_boolean_value', {
        table_name: 'scenarios',
        boolean_column_name: field,
        id_column_name: 'id',
        row_id: scenario.id
      })

    if (error) console.error(error)
  }
}

const ScenarioService = new ScenarioServiceClass();

export default ScenarioService;