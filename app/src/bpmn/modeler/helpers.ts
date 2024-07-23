import { BpmnParsingError } from "@/errors/custom.ts";
import { find_path, Graph } from "dijkstrajs";

interface ModdleElement {
  $type: string;
  id: string;
  flowElements: FlowElement[];
}

interface FlowElement {
  $type: string;
  id: string;
  lessonToSolve?: string;
  achievementToAssign?: string,
  objectiveToGrantXPTo?: string,
  xp?: string,
  sourceRef?: { id: string };
  targetRef?: { id: string };
}

export async function validateProcessDefinition(processDefinition: ModdleElement): Promise<void> {
  const allowedElements = [
    "bpmn:UserTask",
    "bpmn:SequenceFlow",
    "bpmn:ExclusiveGateway",
    "bpmn:ServiceTask",
    "bpmn:StartEvent",
    "bpmn:EndEvent"
  ];

  const flowElements = processDefinition.flowElements;
  const invalidElements = flowElements.filter(
    (element: FlowElement) => !allowedElements.includes(element.$type)
  );

  if (invalidElements.length > 0) {
    const invalidElementTypes = invalidElements.map(element => element.$type).join(", ");
    throw new BpmnParsingError(`Szenario enthält unerlaubte Elemente: ${invalidElementTypes}`);
  }

  const userTasks = flowElements.filter((element: FlowElement) => element.$type === "bpmn:UserTask");
  const serviceTasks = flowElements.filter((element: FlowElement) => element.$type === "bpmn:ServiceTask");
  const startEvents = flowElements.filter((element: FlowElement) => element.$type === "bpmn:StartEvent");
  const endEvents = flowElements.filter((element: FlowElement) => element.$type === "bpmn:EndEvent");

  if (startEvents.length === 0) throw new BpmnParsingError("Szenario enthält kein StartEvent.");
  if (startEvents.length > 1) throw new BpmnParsingError("Szenario enthält mehr als ein StartEvent.");
  if (endEvents.length === 0) throw new BpmnParsingError("Szenario enthält kein EndEvent.");
  if (endEvents.length > 1) throw new BpmnParsingError("Szenario enthält mehr als ein EndEvent.");
  if (userTasks.length === 0) throw new BpmnParsingError("Szenario enthält keine Lektionen.");

  const userTasksWithoutLessonId = userTasks.filter(task => !task.lessonToSolve);
  if (userTasksWithoutLessonId.length > 0) {
    throw new BpmnParsingError("Es gibt UserTasks ohne eine Lesson.");
  }

  const serviceTaskWithoutAchievementOrObjective = serviceTasks.filter(task => !(task.achievementToAssign || (task.objectiveToGrantXPTo && task.xp)));
  if (serviceTaskWithoutAchievementOrObjective.length > 0) {
    throw new BpmnParsingError("Es gibt ServiceTasks ohne zugewiesenes Achievement oder Objective mit XP.");
  }
}

export async function findShortestPath(processDefinition: ModdleElement): Promise<string[]> {
  const graph: Graph = {};
  const userTasks = processDefinition.flowElements.filter((element: FlowElement) => element.$type === "bpmn:UserTask");
  const startNode = processDefinition.flowElements.find((element: FlowElement) => element.$type === "bpmn:StartEvent")!.id;
  const endNode = processDefinition.flowElements.find((element: FlowElement) => element.$type === "bpmn:EndEvent")!.id;

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

export async function getAllUserTaskIds(processDefinition: ModdleElement): Promise<string[]> {
  return processDefinition.flowElements
    .filter((element: FlowElement) => element.$type === "bpmn:UserTask")
    .map(task => task.lessonToSolve!)
    .filter(lessonToSolve => lessonToSolve !== undefined);
}