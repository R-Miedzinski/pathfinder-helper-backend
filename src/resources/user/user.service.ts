import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  public async findAll() {
    return await this.userRepository.find({
      relations: ['user_games', 'user_characters'],
    });
    // return `This action returns all user`;
  }

  public async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['user_games', 'user_characters'],
    });
    // return `This action returns a #${id} user`;
  }

  public update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  public remove(id: number) {
    return `This action removes a #${id} user`;
  }

  public login(createUserDto: CreateUserDto) {
    return 'This action logs in a user';
  }
}
