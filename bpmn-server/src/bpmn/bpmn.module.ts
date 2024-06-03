import { Module } from "@nestjs/common";
import { BPMNController } from "./bpmn.controller";
import { BPMNService } from "./bpmn.service";
import { SupabaseModule } from "../common/supabase/index";

@Module({
  imports: [SupabaseModule],
  controllers: [BPMNController],
  providers: [BPMNService],
  exports: [BPMNService],
})
export class BPMNModule {}