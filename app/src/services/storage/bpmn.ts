import { supabase } from "@/plugins/supabase";

class BpmnStorageServiceClass {

  public push = {
    uploadDiagram: this.uploadDiagram.bind(this),
    updateDiagram: this.updateDiagram.bind(this),
    deleteDiagram: this.deleteDiagram.bind(this)
  };

  private async uploadDiagram(userUUID: string, scenarioId: string, diagramId: string, bpmnContent: Blob, svgContent: Blob): Promise<{
    bpmnPath: string,
    svgPath: string
  }> {
    const bpmnPath = `${userUUID}/${scenarioId}/${diagramId}.bpmn`;
    const svgPath = `${userUUID}/${scenarioId}/${diagramId}.svg`;

    let { error: bpmnError } = await supabase.storage
      .from("bpmn")
      .upload(bpmnPath, bpmnContent);

    if (bpmnError) throw bpmnError;

    let { error: svgError } = await supabase.storage
      .from("bpmn")
      .upload(svgPath, svgContent);

    if (svgError) throw svgError;

    return { bpmnPath, svgPath };
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
}

export const BpmnStorageService = new BpmnStorageServiceClass();