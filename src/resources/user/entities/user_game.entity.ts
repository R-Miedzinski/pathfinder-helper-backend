import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity('User_Game')
export class UserGame {
    @Column({primary: true})
    user_id: string;

    @Column({primary: true})
    game_id: string;
}