import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Unique, ManyToMany, JoinTable } from 'typeorm';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { RoleEnum } from './role.enum';
import * as crypto from 'crypto';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../company/model/company.entity'

@Entity()
@Unique(['mail'])
export class User {
  @ApiProperty({
    example: '4',
    description: 'Id of user.',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'firstname.lastname@tum.de',
    description: 'An email address used for invitation mail and as login name.',
  })
  @Column({ length: 250 })
  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @ApiProperty({
    example: 'Cayenne Tina',
    description: 'First and middle name of user.',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Mustermann',
    description: 'Last name of user.',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'User',
    description: 'Role of user.',
    enum: RoleEnum,
  })
  @Column({
    enum: RoleEnum,
    default: RoleEnum.User,
  })
  role: number;

  @Exclude()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }

  @ApiProperty({
    description: 'Array of companies the user is following.',
    type: Company,
    isArray: true
  })
  @ManyToMany(type => Company)
  @JoinTable()
  followingCompanies: Company[];
}
