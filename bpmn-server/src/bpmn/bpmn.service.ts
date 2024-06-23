import { Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { BPMNAPI, BPMNServer, IExecution, Logger, SecureUser } from "bpmn-server";
import { configuration } from "./configuration";
import { CustomSecureUser } from "./customSecureUser";
import { BPMNLoggerService } from "./logger.service";

@Injectable()
export class BPMNService {
  private server: BPMNServer;
  private eventEmitter: EventEmitter2;
  public api: BPMNAPI;

  constructor(private readonly loggerService: BPMNLoggerService) {
    this.server =
      new BPMNServer(configuration,
        new Logger({
          toConsole: false,
          callback: loggerService.callback.bind(loggerService)
        }), {
      cron: false,
    });
    this.api = new BPMNAPI(this.server);

    let self = this;

    this.eventEmitter = new EventEmitter2();

    this.server.listener.on("all", async function ({ context, event }) {
      self.eventEmitter.emit(event, context);
    });
  }

  async persistDiagram(processId: string, user: CustomSecureUser, diagram: string) {
    await this.api.model.save(processId, diagram,null, user);
  }

  async startWorkflow(workflowId: string, user: SecureUser, data?: any) {
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

  async invokeItem(itemId: string, user: SecureUser, points?: number) {
    const query: Object = { "items.id": itemId };
    const data = points ? { points: points } : {};

    try {
      const result: IExecution = await this.api.engine.invoke(query, data, user);

      return {
        processName: result.name,
        id: result.id,
        status: result.status
      };

    } catch (e: any) {
      this.loggerService.error(e.message);
      throw new NotFoundException(
        `No items to invoke found for the provided itemId: ${itemId} and userId ${user.tenantId}`);
    }

  }

  async getPendingUserTaskInWorkflowFromUser(workflowId: string, user: CustomSecureUser){
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
