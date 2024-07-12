import {supabase} from "@/plugins/supabase";
import { Scenario, ScenarioDTO } from "@/types/scenario.ts";
import { mapToScenario } from "@/mapper/scenario.ts";

class ScenarioServiceClass {

  public pull = {
    fetchScenarios: this.fetchScenarios.bind(this),
    fetchScenario: this.fetchScenarioById.bind(this)
  };

  public push = {
    uploadScenario: this.uploadScenario.bind(this)
  }

  private async uploadScenario(scenario: Scenario): Promise<Scenario | undefined> {

    const { data, error } = await supabase
      .from('scenarios')
      .insert({
        id: scenario.id,
        user_id: scenario.user,
        description: scenario.description,
        title: scenario.title,
        processDefinitionKey: scenario.processDefinitionKey,
        bpmn_path: scenario.bpmnPath,
        svg_path: scenario.svgPath
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
}

const ScenarioService = new ScenarioServiceClass();

export default ScenarioService;