import { Controller, Post, Param, UseGuards, Req, Body, Get, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BPMNService } from './bpmn.service';
import { AuthGuard } from "./auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('bpmn')
@UseGuards(AuthGuard)
export class BPMNController {
  constructor(private readonly bpmnService: BPMNService) {}

  @Post('persist')
  @UseInterceptors(FileInterceptor('bpmn'))
  async persistProcess(
    @Body('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request
  ): Promise<any> {
    const user = request['user'];
    return this.bpmnService.persistDiagram(file.originalname.split('.')[0], user, file.buffer.toString());
  }

  @Post('start/:workflowId')
  async startWorkflow(
    @Param('workflowId') workflowId: string,
    @Req() request: Request
  ) {
    const user = request['user'];
    return this.bpmnService.startWorkflow(workflowId, user, {starterUserId: user.tenantId});
  }

  @Post('/invoke/:itemId')
  async invokeItem(
    @Param('itemId') itemId: string,
    @Body('points') points: number,
    @Req() request: Request
  ) {
    const user = request['user'];
    return this.bpmnService.invokeItem(itemId, user, points);
  }

  @Get('/data/pendingUserTasks/:workflowId')
  async getPendingUserTask(
    @Param('workflowId') workflowId: string,
    @Req() request: Request
    ){
    const user = request['user'];
    return this.bpmnService.getPendingUserTaskInWorkflowFromUser(workflowId, user)
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
