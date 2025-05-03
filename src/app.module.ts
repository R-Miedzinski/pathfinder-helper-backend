import { MiddlewareConsumer, Module, NestModule, Req, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './resources/user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './resources/game/game.module';
import { CharacterModule } from './resources/character/character.module';
import { RequireRoleGuard } from './common/guards/require-role/require-role.guard';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';
import { UserMiddleware } from './middlewares/user/user.middleware';
import { TraitModule } from './resources/trait/trait.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('ENVIROMENT') === 'dev',
      }),
    }),
    UserModule,
    GameModule,
    CharacterModule,
    TraitModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware, LoggerMiddleware).forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
