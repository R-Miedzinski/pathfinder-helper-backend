import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EUserRoles } from 'src/common/enums/user-roles.enum';

@Injectable()
export class RequireRoleGuard implements CanActivate {
  constructor(private readonly role: EUserRoles) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming `user` is set by a middleware or another guard
    return user?.role === this.role;
  }
}
