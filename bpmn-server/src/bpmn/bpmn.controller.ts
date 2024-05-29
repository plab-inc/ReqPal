import { Controller, Post, Param, UseGuards, Req, Body, Get } from "@nestjs/common";
import { BPMNService } from './bpmn.service';
import { AuthGuard } from "../auth/auth.guard";
import { SecureUser } from "bpmn-server";

@Controller('bpmn')
@UseGuards(AuthGuard)
export class BPMNController {
  constructor(private readonly bpmnService: BPMNService) {}

  @Post('persist')
  async persistProcess(
    @Body('id') id: string,
    @Req() request: Request
  ): Promise<any> {
    const user = request['user'];
    return this.bpmnService.persistDiagram(id, user);
  }

  @Post('start/:workflowId')
  async startWorkflow(
    @Param('workflowId') workflowId: string,
    @Body() data: Object,
    @Req() request: Request
  ) {
    const user = request['user'];
    return this.bpmnService.startWorkflow(workflowId, user, data);
  }

  @Get('/invoke/:itemId')
  async invokeItem(
    @Param('itemId') itemId: string,
    @Req() request: Request
  ){
    const user = request['user'];
    this.bpmnService.invokeItem(itemId, user)
    return "Process done"
  }

  @Get('/data/pendingUserTasks/:workflowId')
  async getPendingUserTask(
    @Param('workflowId') workflowId: string,
    @Req() request: Request
    ){
    const user = request['user'];
    return this.bpmnService.getPendingUserTaskInWorkflowFromUser(workflowId,user)
  }

  @Get('/data/instances/:workflowId')
  async getInstancesByWorkflowFromUser(
    @Param('workflowId') workflowId: string,
    @Req() request: Request
  ){
    const user = request['user'];
    return this.bpmnService.getWorkflowInstancesFromUser(workflowId,user)
  }

}
