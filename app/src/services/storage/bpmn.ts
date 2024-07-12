import { supabase } from "@/plugins/supabase";
import { Scenario } from "@/types/scenario.ts";

class BpmnStorageServiceClass {

  public push = {
    uploadScenarioAssets: this.uploadScenarioAssets.bind(this),
    updateDiagram: this.updateDiagram.bind(this),
    deleteDiagram: this.deleteDiagram.bind(this)
  };

  public pull = {
    getDiagramSvg: this.getDiagramSvg.bind(this)
  };

  private async uploadScenarioAssets(scenario: Scenario): Promise<{ bpmnPath: string, svgPath: string } | undefined> {
    const bpmnPath = `${scenario.user}/${scenario.id}/${scenario.title}.bpmn`;
    const svgPath = `${scenario.user}/${scenario.id}/${scenario.title}.svg`;

    if (scenario.bpmnXml && scenario.svg) {
      const xmlBlob = new Blob([scenario.bpmnXml], { type: 'text/xml' });
      const svgBlob = new Blob([scenario.svg], { type: 'image/svg+xml' });

      let { data: bpmnData, error: bpmnError } = await supabase.storage
        .from("bpmn")
        .upload(bpmnPath, xmlBlob);

      if (bpmnError) throw bpmnError;

      let { data: svgData, error: svgError } = await supabase.storage
        .from("bpmn")
        .upload(svgPath, svgBlob);

      if (svgError) throw svgError;

      if(bpmnData && svgData) {
        return { bpmnPath: bpmnData.path, svgPath: svgData.path };
      }
    }

    return undefined;
  }

  private async updateDiagram(userUUID: string, scenarioId: string, diagramId: string, bpmnContent: Blob, svgContent: Blob): Promise<{
    bpmnPath: string,
    svgPath: string
  }> {
    const bpmnPath = `${userUUID}/${scenarioId}/${diagramId}.bpmn`;
    const svgPath = `${userUUID}/${scenarioId}/${diagramId}.svg`;

    let { data: bpmnData, error: bpmnError } = await supabase.storage
      .from("bpmn")
      .update(bpmnPath, bpmnContent, {
        cacheControl: "3600",
        upsert: true
      });

    if (bpmnError) throw bpmnError;

    let { data: svgData, error: svgError } = await supabase.storage
      .from("bpmn")
      .update(svgPath, svgContent, {
        cacheControl: "3600",
        upsert: true
      });

    if (svgError) throw svgError;

    return { bpmnPath, svgPath };
  }

  private async deleteDiagram(userUUID: string, scenarioId: string, diagramId: string): Promise<void> {
    const bpmnPath = `${userUUID}/${scenarioId}/${diagramId}.bpmn`;
    const svgPath = `${userUUID}/${scenarioId}/${diagramId}.svg`;

    let { error: bpmnError } = await supabase.storage
      .from("bpmn")
      .remove([bpmnPath]);

    if (bpmnError) throw bpmnError;

    let { error: svgError } = await supabase.storage
      .from("bpmn")
      .remove([svgPath]);

    if (svgError) throw svgError;
  }

  private async getDiagramSvg(scenario: Scenario): Promise<string | undefined>{

    if (scenario.svgPath != null) {
      const { data, error } = await supabase.storage.from("bpmn").download(scenario.svgPath);

      if(error) throw error;

      return await data.text() || "";

    }

    return undefined;

  }
}

export const BpmnStorageService = new BpmnStorageServiceClass();