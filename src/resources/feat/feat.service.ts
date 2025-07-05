import { Injectable } from '@nestjs/common';
import { CreateFeatDto } from './dto/create-feat.dto';
import { UpdateFeatDto } from './dto/update-feat.dto';
import { Feat } from './entities/feat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { FeatProficiencies } from './entities/feat-proficiencies.entity';
import { FeatChoice } from './entities/feat-choice.entity';

@Injectable()
export class FeatService {
  constructor(
    @InjectRepository(Feat)
    private readonly featRepository: Repository<Feat>,
    @InjectRepository(FeatProficiencies)
    private readonly featProficienciesRepository: Repository<FeatProficiencies>,
    @InjectRepository(FeatChoice)
    private readonly featChoiceRepository: Repository<FeatChoice>,
  ) {}

  public async create(createFeatDto: CreateFeatDto): Promise<Feat> {
    const id = uuidv4();

    const enriched_feat: Feat = {
      ...createFeatDto,
      id,
      active: true,
      dateCreated: new Date(),
    };

    this.featRepository.create(enriched_feat);
    const savedFeat = await this.featRepository.save(enriched_feat);

    if (!savedFeat) {
      return Promise.reject(`Failed to create feat with id ${id}`);
    }

    // Handle OneToOne relationships

    if (savedFeat.featProficiencies) {
      const featProficiencies = this.featProficienciesRepository.create({
        ...savedFeat.featProficiencies,
        id,
      });

      const savedProficiencies =
        await this.featProficienciesRepository.save(featProficiencies);
      await this.featRepository
        .createQueryBuilder()
        .relation(Feat, 'featProficiencies')
        .of(savedFeat)
        .set(savedProficiencies);
    }

    // Handle OneToMany relationships

    if (savedFeat.featChoices?.length) {
      const featChoices: FeatChoice[] = savedFeat.featChoices.map((choice) => ({
        ...choice,
        id: uuidv4(),
        feat: savedFeat.id,
      }));

      const savedChoices = await this.featChoiceRepository.save(featChoices);
      await this.featRepository
        .createQueryBuilder()
        .relation(Feat, 'featChoices')
        .of(savedFeat)
        .add(savedChoices.map((choice) => choice.id));
    }

    return savedFeat;
  }

  public findAll(searchParams?: FindOptionsWhere<Feat>): Promise<Feat[]> {
    const where = { active: true };

    if (searchParams) {
      Object.assign(where, searchParams);
    }

    return this.featRepository.find({
      where,
      relations: [
        'traits',
        'actionsGranted',
        'spellsGranted',
        'featProficiencies',
        'featChoices',
      ],
    });
  }

  public async findOne(id: string): Promise<Feat> {
    return this.featRepository
      .findOne({
        where: { id, active: true },
        relations: [
          'traits',
          'actionsGranted',
          'spellsGranted',
          'featProficiencies',
          'featChoices',
        ],
      })
      .then((feat) => feat || Promise.reject(`Feat with id ${id} not found`));
  }

  public async update(id: string, updateFeatDto: UpdateFeatDto): Promise<Feat> {
    return this.featRepository.findOne({ where: { id } }).then((feat) => {
      if (!feat) {
        return Promise.reject(`Feat with id ${id} not found`);
      }

      Object.assign(feat, updateFeatDto);
      return this.featRepository.save(feat);
    });
  }

  public async remove(id: string): Promise<string> {
    return this.update(id, { active: false }).then(
      (feat) => `Feat with id ${feat.id} has been deactivated`,
    );
  }
}
