import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";

@Entity('User_History')
export class UserHistory {
    @Column()
    id: string;

    @Column()
    previous_id: string;
}