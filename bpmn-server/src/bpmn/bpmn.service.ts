import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { BPMNAPI, BPMNServer, EXECUTION_STATUS, IExecution, Logger, Query, SecureUser, SystemUser } from "bpmn-server";
import { configuration } from "./configuration";

@Injectable()
export class BPMNService {
  private server: BPMNServer;
  private readonly logger = new Logger({ toConsole: true });
  private eventEmitter: EventEmitter2;
  public api: BPMNAPI;

  constructor() {
    this.server = new BPMNServer(configuration, this.logger, {
      cron: false,
    });
    this.api = new BPMNAPI(this.server);

    let self = this;

    this.eventEmitter = new EventEmitter2();

    this.server.listener.on("all", async function ({ context, event }) {
      console.log("emitting ", event);
      self.eventEmitter.emit(event, context);
    });
  }

  async persistDiagram(processId: string, user: SecureUser) {
    const diagram = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_1">
      <bpmn2:outgoing>Flow_0xrdx7t</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:task id="Activity_0ahi6ng" name="Aufgabe">
      <bpmn2:incoming>Flow_0xrdx7t</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0popcjk</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="Flow_0xrdx7t" sourceRef="StartEvent_1" targetRef="Activity_0ahi6ng" />
    <bpmn2:endEvent id="Event_04xhfjk">
      <bpmn2:incoming>Flow_0popcjk</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_0popcjk" sourceRef="Activity_0ahi6ng" targetRef="Event_04xhfjk" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_0xrdx7t_di" bpmnElement="Flow_0xrdx7t">
        <di:waypoint x="448" y="258" />
        <di:waypoint x="500" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0popcjk_di" bpmnElement="Flow_0popcjk">
        <di:waypoint x="600" y="258" />
        <di:waypoint x="652" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="412" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0ahi6ng_di" bpmnElement="Activity_0ahi6ng">
        <dc:Bounds x="500" y="218" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_04xhfjk_di" bpmnElement="Event_04xhfjk">
        <dc:Bounds x="652" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
    `;

    // Hier könnten Sie Benutzerdaten verwenden, um das Diagramm zu personalisieren oder zu loggen
    console.log(`Persisting diagram for user: ${user.userName} with id: ${processId}`);

    await this.api.model.save(processId, diagram,null, SystemUser);
  }

  async startWorkflow(workflowId: string, user: SecureUser, data?: any) {
    console.log("Starting Workflow");

    const result: IExecution = await this.api.engine.start(
      workflowId,
      data,
      user
    );
    return {
      processName: result.name,
      id: result.id,
      status: result.status,
    };
  }

  async invokeItem(itemId: string, user: SecureUser) {
    const query: Object = { "items.id": itemId }
    return await this.api.engine.invoke(query, {}, user);
  }

  async getPendingUserTaskInWorkflowFromUser(workflowId: string, user: SecureUser){
    const query: Object = {'name': workflowId, 'items.type': "bpmn:UserTask", 'items.status': 'wait'}
    return await this.api.data.findItems(query, user)
  }

  async getWorkflowInstancesFromUser(workflowId: string, user: SecureUser){
    const query: any = { name: workflowId }
    return await this.api.data.findInstances(query, user)
  }

  async getNodeFromWorkflowFromUser(workflowId: string, nodeType: string, user: SecureUser, status?: string){
    const query: Object = {'name': workflowId, 'items.type': "bpmn:UserTask", 'items.status': status};
    return await this.api.data.findItems(query, user)
  }

  async getInstancesFromUser(user: SecureUser){
    const query: any = {}
    return await this.api.data.findInstances(query, user)
  }

  async getRunningWorkflowInstancesFromUser(user: SecureUser){
    const query: any = { type: 'running' }
    return await this.api.data.findInstances(query, user)
  }

}
