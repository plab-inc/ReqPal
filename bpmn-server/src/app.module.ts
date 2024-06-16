import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BPMNModule } from "./bpmn/bpmn.module";
import { ConfigModule } from "@nestjs/config";
import { SupabaseGuard, SupabaseModule } from "./common/supabase/index";
import { APP_GUARD } from "@nestjs/core";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";


@Module({
  imports: [
    BPMNModule,
    ConfigModule.forRoot(),
    PassportModule,
    SupabaseModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10
    }])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: SupabaseGuard
    }
  ]
})
export class AppModule {
}