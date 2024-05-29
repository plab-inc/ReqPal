import { Module } from "@nestjs/common";
import { BPMNController } from "./bpmn.controller";
import { BPMNService } from "./bpmn.service";

@Module({
  imports: [],
  controllers: [BPMNController],
  providers: [BPMNService],
  exports: [BPMNService],
})
export class BPMNModule {}