import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user_auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserGame } from './entities/user_game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAuth, UserGame]), JwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
