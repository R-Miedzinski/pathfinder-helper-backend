import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(@InjectRepository(Game) private readonly gameRepository: Repository<Game>) {}

  public create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  public async findAll() {
    return await this.gameRepository.find({
      relations: ['players', 'game_master'],
    });
    // return `This action returns all game`;
  }

  public findOne(id: string) {
    return `This action returns a #${id} game`;
  }

  public update(id: string, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  public remove(id: string) {
    return `This action removes a #${id} game`;
  }
}
