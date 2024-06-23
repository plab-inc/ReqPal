import { Module } from "@nestjs/common";
import { BPMNController } from "./bpmn.controller";
import { BPMNService } from "./bpmn.service";
import { SupabaseModule } from "../common/supabase/index";
import { BPMNLoggerService } from "./logger.service";

@Module({
  imports: [SupabaseModule],
  controllers: [BPMNController],
  providers: [BPMNService, BPMNLoggerService],
  exports: [BPMNService],
})
export class BPMNModule {}