import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity('User_Game')
export class UserGame {
    @Column()
    user_id: string;

    @Column()
    game_id: string;
}