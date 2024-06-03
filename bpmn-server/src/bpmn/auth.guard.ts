import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SecureUser } from "bpmn-server";
import { Supabase } from '../common/supabase';
import { AuthUser } from "@supabase/supabase-js";
import { ExtractJwt } from 'passport-jwt';
import { CustomSecureUser } from "./customSecureUser";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly supabase: Supabase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const jwtToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const { data, error} = await this.supabase.getClient().auth.getUser(jwtToken);
    const supabaseUser = data.user

    if(!supabaseUser) {
      const userGroups = request.get('userGroups');
      const user = new CustomSecureUser({
        userName: request.get('username'),
        userGroups: userGroups ? userGroups.split(',') : ['student'],
        tenantId: request.get('tenantId'),
        modelsOwner: request.get('tenantId'),
      });
      request['user'] = user;
      return true;
    }

    if (supabaseUser) {
      const user = new CustomSecureUser({
        userName: supabaseUser.user_metadata.username,
        userGroups: supabaseUser.app_metadata.userroles,
        tenantId: supabaseUser.id,
      });
      request['user'] = user;
      return true;
    }
    return false;
  }
}
