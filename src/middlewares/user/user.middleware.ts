import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  public use(req: any, res: any, next: () => void) {
    if (!req.headers) {
      console.log('No headers provided');
      return next();
    }

    const token = this.extractTokenFromHeader(req);
    if (token) {
      const decoded = this.authService.decodeToken(token);
      req.user = decoded;
    } else {
      console.log('No token provided');
    }
    next();
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
