import { supabase } from "@/plugins/supabase";
import { Scenario } from "@/types/scenario.ts";

class BpmnStorageServiceClass {

  public push = {
    manageScenarioAssets: this.manageScenarioAssets.bind(this)
  };

  public pull = {
    getDiagramSvg: this.getDiagramSvg.bind(this),
    getDiagramXml: this.getDiagramXml.bind(this)
  };

  private async manageScenarioAssets(scenario: Scenario, action: 'upload' | 'delete'): Promise<{ bpmnPath?: string, svgPath?: string } | void> {
    const bpmnPath = `${scenario.user}/${scenario.id}/${scenario.title}.bpmn`;
    const svgPath = `${scenario.user}/${scenario.id}/${scenario.title}.svg`;

    if (action === 'delete') {
      let { error: bpmnError } = await supabase.storage
        .from("bpmn")
        .remove([bpmnPath]);

      if (bpmnError) throw bpmnError;

      let { error: svgError } = await supabase.storage
        .from("bpmn")
        .remove([svgPath]);

      if (svgError) throw svgError;

      return;
    }

    if (scenario.bpmnXml && scenario.svg) {
      const xmlBlob = new Blob([scenario.bpmnXml], { type: 'text/xml' });
      const svgBlob = new Blob([scenario.svg], { type: 'image/svg+xml' });

      let { data: bpmnData, error: bpmnError } = await supabase.storage
        .from("bpmn")
        .upload(bpmnPath, xmlBlob, {
          cacheControl: '3600',
          upsert: true
        });

      if (bpmnError) throw bpmnError;

      let { data: svgData, error: svgError } = await supabase.storage
        .from("bpmn")
        .upload(svgPath, svgBlob, {
          cacheControl: '3600',
          upsert: true
        });

      if (svgError) throw svgError;

      if (bpmnData && svgData) {
        return { bpmnPath: bpmnData.path, svgPath: svgData.path };
      }
    }

    return undefined;
  }

  private async getDiagramSvg(scenario: Scenario): Promise<string | undefined> {
    if (scenario.svgPath != null) {
      const { data, error } = await supabase.storage.from("bpmn").download(scenario.svgPath);

      if (error) throw error;

      return await data.text() || "";
    }

    return undefined;
  }

  private async getDiagramXml(scenario: Scenario): Promise<string | undefined> {
    if (scenario.bpmnPath != null) {
      const { data, error } = await supabase.storage.from("bpmn").download(scenario.bpmnPath);

      if (error) throw error;

      return await data.text() || "";
    }

    return undefined;
  }
}

export const BpmnStorageService = new BpmnStorageServiceClass();