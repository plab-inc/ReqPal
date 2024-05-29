import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SecureUser } from "bpmn-server";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const headers = request.headers;

    if (headers.username && headers.usergroups && headers.tenantid) {
      const userGroups = (headers.usergroups as string).split(',');
      const user = new SecureUser({
        userName: headers.username as string,
        userGroups: userGroups,
        tenantId: headers.tenantid as string
      });
      request['user'] = user; // Benutzer im Request speichern
      return true;
    }

    // Standardmäßig den Zugriff verweigern, wenn keine Authentifizierungsdaten vorhanden sind
    return false;
  }
}
