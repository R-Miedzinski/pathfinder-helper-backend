import { EUserRoles } from 'src/common/enums/user-roles.enum';

export class UserDto {
  id: number;
  role: EUserRoles;
  username: string;
  // TODO: apply correctly when defined
  // userGames: GameDto[];
  // userCharacters: CharacterDto[];
}
