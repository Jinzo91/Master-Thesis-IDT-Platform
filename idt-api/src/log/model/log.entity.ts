import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, BeforeInsert } from "typeorm";
import { HttpMethodEnum } from "./http-method.enum";
import { EventEnum } from "./event.enum";
import { User } from "./../../user/model/user.entity";
import { LogTypeEnum } from "./log-type.enum";

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        enum: LogTypeEnum,
    })
    logType: number;

    @Column()
    timestamp: string;

    @Column({
        nullable: true
    })
    leadTime: number;

    @Column({
        enum: HttpMethodEnum,
    })
    httpMethod: number;

    @Column()
    resource: string;

    @Column({
        nullable: true,
    })
    resourceType: number;

    @Column({
        enum: EventEnum,
    })
    event: number;

    @Column()
    success: boolean;

    @ManyToOne(type => User)
    @JoinColumn()
    user: number;

    @BeforeInsert()
    async setDate() {
        this.timestamp = new Date().toISOString();
    }
}