import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  public use(req: any, res: any, next: () => void) {
    const token = this.extractTokenFromHeader(req);
    if (token) {
      const decoded = this.authService.decodeToken(token);
      req.user = decoded;
    } else {
      console.log('No token provided');
    }
    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.get('authorization')?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
