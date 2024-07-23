interface ModdleElement {
  $type: string;
  id: string;
  flowElements: FlowElement[];
}

interface FlowElement {
  $type: string;
  id: string;
  lessonToSolve?: string;
  sourceRef?: { id: string };
  targetRef?: { id: string };
}

import { find_path, Graph } from "dijkstrajs";

export async function findShortestPath(definitions: { rootElements: ModdleElement[] }): Promise<string[] | null> {
  const processDefinition = definitions.rootElements[0];
  if (!processDefinition) return null;

  const graph: Graph = {};
  const userTasks = processDefinition.flowElements.filter((element: FlowElement) => element.$type === "bpmn:UserTask");
  const startEvent = processDefinition.flowElements.find((element: FlowElement) => element.$type === "bpmn:StartEvent");
  const endEvent = processDefinition.flowElements.find((element: FlowElement) => element.$type === "bpmn:EndEvent");

  if (!startEvent || !endEvent || userTasks.length === 0) return null;

  const startNode = startEvent.id;
  const endNode = endEvent.id;

  const addToGraph = (sourceId: string, targetId: string) => {
    if (!graph[sourceId]) graph[sourceId] = {};
    graph[sourceId][targetId] = 1;
  };

  processDefinition.flowElements.forEach((element: FlowElement) => {
    if (element.$type === "bpmn:SequenceFlow") {
      addToGraph(element.sourceRef!.id, element.targetRef!.id);
    }
  });

  const shortestPath = find_path(graph, startNode, endNode);
  const userTaskIds = userTasks.map(task => task.id);

  return shortestPath
    .filter(node => userTaskIds.includes(node))
    .map(node => userTasks.find(task => task.id === node)!.lessonToSolve!)
    .filter(lessonToSolve => lessonToSolve !== undefined);
}

export async function getAllUserTaskIds(definitions: { rootElements: ModdleElement[] }): Promise<string[] | null> {
  const processDefinition = definitions.rootElements[0];
  if (!processDefinition) return null;

  return processDefinition.flowElements
    .filter((element: FlowElement) => element.$type === "bpmn:UserTask")
    .map(task => task.lessonToSolve!)
    .filter(lessonToSolve => lessonToSolve !== undefined);
}