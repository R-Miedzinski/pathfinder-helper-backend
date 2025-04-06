import { Character } from 'src/resources/character/entities/character.entity';
import { Game } from 'src/resources/game/entities/game.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable, JoinColumn } from 'typeorm';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id: string;
    
    @Column()
    role: string;
    
    @Column()
    email: string;

    @Column()
    username: string;

    // @Column()
    // password: string;

    // @Column()
    // salt: string;

    @ManyToMany(() => Game, (game) => game.players)
    @JoinTable({ 
        name: 'User_Game',
        joinColumn:{
            name: 'user_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn:{
            name: 'game_id',
            referencedColumnName: 'id'
        }
     }) // Junction table
    user_games: Game[];
    
    @OneToMany(() => Character, (character) => character.player)
    user_characters: Character[];

    @Column({ default: true })
    active: boolean;

    // @Column()
    // update_history: string[];
}
