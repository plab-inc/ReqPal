import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BPMNModule } from "./bpmn/bpmn.module";
import { ConfigModule } from '@nestjs/config';
import { SupabaseGuard, SupabaseModule } from "./common/supabase/index";
import { APP_GUARD } from "@nestjs/core";
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [BPMNModule, ConfigModule.forRoot(), PassportModule, SupabaseModule ],
  controllers: [AppController],
  providers: [
      AppService,
      {
        provide: APP_GUARD,
        useClass: SupabaseGuard,
      }
    ],
})
export class AppModule {}
