import { Injectable } from '@nestjs/common';
import { CreateBackgroundDto } from './dto/create-background.dto';
import { UpdateBackgroundDto } from './dto/update-background.dto';
import { Background } from './entities/background.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BackgroundService {
  constructor(
    @InjectRepository(Background)
    private readonly backgroundRepository: Repository<Background>,
  ) {}

  public async create(
    createBackgroundDto: CreateBackgroundDto,
  ): Promise<Background> {
    const id = uuidv4();

    const enriched_background: Background = {
      ...createBackgroundDto,
      id,
      active: true,
      dateCreated: new Date(),
    };

    this.backgroundRepository.create(enriched_background);
    const savedBackground =
      await this.backgroundRepository.save(enriched_background);

    if (!savedBackground) {
      return Promise.reject(`Failed to create background with id ${id}`);
    }

    return savedBackground;
  }

  public async findAll(): Promise<Background[]> {
    return this.backgroundRepository.find({
      where: { active: true },
      relations: ['feat'],
    });
  }

  public async findOne(id: string): Promise<Background> {
    return this.backgroundRepository
      .findOne({
        where: { id, active: true },
        relations: ['feat'],
      })
      .then((background) => {
        if (!background) {
          throw new Error(`Background with id ${id} not found`);
        }

        return background;
      });
  }

  public async update(
    id: string,
    updateBackgroundDto: UpdateBackgroundDto,
  ): Promise<Background> {
    return this.backgroundRepository
      .findOne({ where: { id } })
      .then((background) => {
        if (!background) {
          throw new Error(`Background with id ${id} not found`);
        }

        Object.assign(background, updateBackgroundDto);

        return this.backgroundRepository.save(background);
      });
  }

  public async remove(id: string): Promise<string> {
    return this.update(id, { active: false })
      .then(() => {
        return `Background with id ${id} has been successfully deactivated`;
      })
      .catch((error) => {
        throw new Error(
          `Failed to deactivate background with id ${id}: ${error.message}`,
        );
      });
  }
}
