import { User } from "src/resources/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Character')
export class Character {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, (user) => user.user_characters)
    @JoinColumn({ name: 'player' })
    player: User;
}
