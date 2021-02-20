import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from "class-validator";

@Entity()
export class Technology {
    @ApiProperty({
        example: 4,
        description: 'Id of technology.',
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: 'Node.JS',
        type: String,
        description: 'A technologies name.',
    })
    @IsString()
    @IsNotEmpty()
    @Column()
    name: string;
}