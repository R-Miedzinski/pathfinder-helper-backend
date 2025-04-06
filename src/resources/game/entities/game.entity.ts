import { User } from "src/resources/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Game')
export class Game {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToMany(() => User, (user) => user.user_games)
    @JoinTable({ name: 'User_Game',
        joinColumn: {
            name: 'game_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
     }) // Junction table
    players: User[];

    @OneToOne(() => User)
    @JoinColumn({ name: 'game_master' })
    game_master: User;
}
