import { Injectable, NestMiddleware } from '@nestjs/common';
import { User } from 'src/resources/user/entities/user.entity';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const { method, originalUrl } = req;
    const user: User = req.user || null;
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${method} ${originalUrl} ${user ? `User: ${user.username}` : ''}`;
    console.log(logMessage);
    next();
  }
}
