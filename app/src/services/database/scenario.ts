import { supabase } from "@/plugins/supabase";
import { Scenario, ScenarioDTO, ScenarioProgress } from "@/types/scenario.ts";
import { mapToScenario } from "@/mapper/scenario.ts";

class ScenarioServiceClass {

  public pull = {
    fetchScenarios: this.fetchScenarios.bind(this),
    fetchScenario: this.fetchScenarioById.bind(this)
  };

  public push = {
    uploadScenario: this.uploadScenario.bind(this),
    toggleField: this.toggleField.bind(this),
    deleteScenario: this.deleteScenario.bind(this)
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

  public async fetchScenarioProgressByScenario(scenarioId: string): Promise<ScenarioProgress | undefined> {

    const { data, error } = await supabase
      .from("user_scenario")
      .select(`*,scenario:scenarios(*)`)
      .eq("scenario_id", scenarioId)
      .single();

    if (error) throw error;

    if (data && data.scenario) {
      return {
        scenario: {
          id: data.scenario.id,
          user: data.scenario.user_id,
          title: data.scenario.title,
          description: data.scenario.description || "",
          deployed: data.scenario.deployed,
          locked: data.scenario.locked,
          lessonsCount: data.scenario.lessons,
          minLessons: data.scenario.minLessons,
          version: data.scenario.version,
          createdAt: data.scenario.created_at
        },
        user_id: data.user_id,
        currentStep: data.currentStep,
        started: data.started,
        ended: data.ended,
        currentLessonId: data.currentLesson_id || undefined
      };
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