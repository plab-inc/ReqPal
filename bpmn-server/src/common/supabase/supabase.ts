import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { ExtractJwt } from 'passport-jwt';
import * as process from "node:process";

@Injectable({ scope: Scope.REQUEST })
export class Supabase {
  private readonly logger = new Logger(Supabase.name);
  private supabase: SupabaseClient;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly configService: ConfigService,
  ) {}

  getClient() {
    this.logger.log('getting supabase client...');
    if (this.supabase) {
      this.logger.log('client exists - returning for current Scope.REQUEST');
      return this.supabase;
    }

    this.logger.log('initialising new supabase client for new Scope.REQUEST');

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
    );

    return this.supabase;

  }
}
