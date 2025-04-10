import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private __secret: string;

    constructor(public readonly jwtService: JwtService,
        public readonly configService: ConfigService) {
        this.__secret = configService.get<string>('JWT_SECRET') ?? '';
    }

    public validatePassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    public hashPassword(password: string, salt: string): string {
        return bcrypt.hashSync(password, salt);
    }

    public encodeToken<T extends object>(payload: T, expiration: string | number): string {
        const token = this.jwtService.sign(payload, { expiresIn: expiration });

        return token;
    }   

    public decodeToken<T extends object>(token: string): T | null{
        try {
            const decoded = this.jwtService.verify<T>(token, { secret: this.__secret });
            return decoded;
        } catch (error) {
            console.log('Error decoding token:', error);

            return null;
        }
    }

    public validateToken(token: string): boolean {
        try {
            this.jwtService.verify(token, { secret: this.__secret,  });
            return true;
        } catch (error) {
            console.log('Error validating token:', error);
            return false;
        }
    }
}
