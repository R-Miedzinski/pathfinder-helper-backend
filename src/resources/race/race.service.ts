import { Injectable } from '@nestjs/common';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { Race } from './entities/race.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RaceService {
  constructor(
    @InjectRepository(Race) private readonly raceRepository: Repository<Race>,
  ) {}

  public async create(createRaceDto: CreateRaceDto): Promise<Race> {
    const id = uuidv4();

    const enriched_race: Race = {
      ...createRaceDto,
      id,
      active: true,
      dateCreated: new Date(),
    };

    this.raceRepository.create(enriched_race);
    const savedRace = await this.raceRepository.save(enriched_race);

    if (!savedRace) {
      return Promise.reject(`Failed to create race with id ${id}`);
    }

    return savedRace;
  }

  public findAll(): Promise<Race[]> {
    return this.raceRepository.find({
      where: { active: true },
      relations: ['darkvision', 'traits'],
    });
  }

  public findOne(id: string): Promise<Race> {
    return this.raceRepository
      .findOne({
        where: { id, active: true },
        relations: ['darkvision', 'traits'],
      })
      .then((race) => {
        if (!race) {
          throw new Error(`Race with id ${id} not found`);
        }

        return race;
      });
  }

  public update(id: string, updateRaceDto: UpdateRaceDto): Promise<Race> {
    return this.raceRepository.findOne({ where: { id } }).then((race) => {
      if (!race) {
        throw new Error(`Race with id ${id} not found`);
      }

      Object.assign(race, updateRaceDto);

      return this.raceRepository.save(race);
    });
  }

  public remove(id: string): Promise<string> {
    return this.update(id, { active: false })
      .then(() => {
        return `Race with id ${id} has been deactivated`;
      })
      .catch((error) => {
        throw new Error(
          `Failed to deactivate race with id ${id}: ${error.message}`,
        );
      });
  }
}
