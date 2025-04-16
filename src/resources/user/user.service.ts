import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserAuth } from './entities/user_auth.entity';
import { LoginDto } from './dto/login.dto';
import { EUserRoles } from '../../common/enums/user-roles.enum';

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/services/auth/auth.service';
import { UserGame } from './entities/user_game.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserAuth) private readonly userAuthRepository: Repository<UserAuth>,
    @InjectRepository(UserGame) private readonly userGameRepository: Repository<UserGame>,
    private readonly authService: AuthService
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const {email, username, password} = createUserDto;

    // create uuid, check if exists, repeat while neccessary
    let userExists = true;
    let userId = '';
    while (userExists) {
      userId = uuidv4();
      userExists = !!await this.userRepository.findOne({ where: { id: userId } });
    }

    // Hash password with salt
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = this.authService.hashPassword(password, salt)

    // Create user auth
    const userAuth = this.userAuthRepository.create({
      id: userId,
      password: hashedPassword,
      salt,
    });
    
    // Create user
    const user = this.userRepository.create({
      id: userId,
      email,
      username,
      role: EUserRoles.USER,
      active: true
    });
    
    // Save user
    await this.userRepository.save(user);

    // Save user auth
    await this.userAuthRepository.save(userAuth);
  }

  public async findAll() {
    return await this.userRepository.find({
      where: { active: true },
      relations: ['user_games', 'user_characters', 'user_games.game_master'],
    });
  }

  public async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['user_games', 'user_characters', 'user_games.game_master'],
    });
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if email or username is changed
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.userRepository.update(id, { email: updateUserDto.email });
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      await this.userRepository.update(id, { username: updateUserDto.username });
    }

    if (updateUserDto.gameId) {
      // Check if gameId already assigned
      const gameId = updateUserDto.gameId;

      const game = await this.userGameRepository.findOne({ where: { user_id: id, game_id: gameId } });
      if (!game) {
        const userGame = this.userGameRepository.create({
          user_id: id,
          game_id: gameId,
        });

        await this.userGameRepository.save(userGame);
      }
    }

    return `This action updates a #${id} user`;
  }

  public async remove(id: string) {
    // set active to false
    await this.userRepository.update(id, { active: false });
    return `This action removes a #${id} user`;
  }

  public async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Check if user exists
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.userAuthRepository.findOne({
      where: { id: user.id },
    }).then((userAuth) => {


      if (!userAuth) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Compare password with hashed password using salt
      const hashedPassword = this.authService.hashPassword(password, userAuth.salt);
      const isPasswordValid = this.authService.validatePassword(hashedPassword, userAuth.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = JSON.parse(JSON.stringify(user));
      const token = this.authService.encodeToken(payload, '1h');
      return {
        access_token: token,
      };
    });
  }
}
