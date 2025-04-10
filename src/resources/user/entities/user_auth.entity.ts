import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity('User_Auth')
export class UserAuth {
    @Column({ primary: true })
    id: string;

    // @OneToOne(() => User)
    // @JoinColumn({name: 'id'})
    // user: User;

    @Column()
    password: string;

    @Column()
    salt: string;
}