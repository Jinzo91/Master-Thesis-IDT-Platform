import { Injectable, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { Repository, DeleteResult, DeepPartial, UpdateResult } from 'typeorm';
import { GetUserDto } from './dto/get-user.dto';
import { CompanyService } from '../company/company.service';
import { Case } from '../case/model/case.entity';
import { CaseService } from '../case/services/case.service';
import { Company } from '../company/model/company.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly companyService: CompanyService,
        private readonly caseService: CaseService
    ) { }

    async create(attributes: DeepPartial<User>): Promise<GetUserDto> {
        return await new Promise<GetUserDto>((resolve, reject) => {

            // necessary for hashPassword()
            // You have to instantiate the Entity and assign the attributes to it in order to use listener decorators.
            const user = Object.assign(new User(), attributes);
            this.userRepository.save(user).then((u) => {
                const getUserDto: GetUserDto = {
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    mail: u.mail,
                    role: u.role,
                    followingCompanies: u.followingCompanies
                };

                resolve(getUserDto);
            }, (err) => {
                reject(err);
            });
        });
    }

    async findByEmail(mail: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                mail,
            },
        });
    }

    async findById(id: number): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }

    async deleteById(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    async createInitialUsers(): Promise<boolean> {
        return await new Promise<boolean>((resolve, reject) => {
            const preuser1: DeepPartial<User> = {
                firstName: 'Paul',
                lastName: 'Weber',
                mail: 'paul.weber@tum.de',
                role: 0,
                password: 'Transformers!'
            };
            const preuser2: DeepPartial<User> = {
                firstName: 'Integration',
                lastName: 'TEST ADMIN',
                mail: 'idt.integration.test.box+adminaccount@gmail.com',
                role: 0,
                password: 'Transformers!'
            };
            const preuser3: DeepPartial<User> = {
                firstName: 'Integration',
                lastName: 'TEST USER',
                mail: 'idt.integration.test.box+useraccount@gmail.com',
                role: 1,
                password: 'Transformers!'
            };

            const user1 = Object.assign(new User(), preuser1);
            const user2 = Object.assign(new User(), preuser2);
            const user3 = Object.assign(new User(), preuser3);

            this.userRepository.save([
                user1,
                user2,
                user3
            ]).then((result) => {
                // console.log(result);
                resolve(true);
            }, (err) => {
                console.log(err);
                reject(false);
            });
        });
    }

    async getFollowingCompanies(userId: number): Promise<number[]> {
        return await new Promise<number[]>((resolve, reject) => {
            this.userRepository.findOneOrFail(userId, { relations: ['followingCompanies'] }).then((user) => {
                let resultArray = [];
                (user.followingCompanies as Array<any>).forEach((c) => resultArray.push(c.id));
                resolve(resultArray);
            }, (err) => {
                reject(err);
            });
          });
    }

    async addCompany(userId: number, compId: number) {
        return await new Promise<number[]>((resolve, reject) => {
            this.companyService.findCompany(compId ? compId : 0).then((c) => {
                this.userRepository.findOneOrFail(userId, { relations: ['followingCompanies'] }).then((user) => {
                    const foundItem = user.followingCompanies.find(followingCompany => followingCompany.id === compId);

                    if (foundItem) {
                        reject(new BadRequestException('User is already following this company.'));
                    } else {
                        user.followingCompanies.push(c);

                        const newU = Object.assign(new User(), user);

                        this.userRepository.save(newU).then(() => {
                            let resultArray = [];
                            (user.followingCompanies as Array<any>).forEach((c) => resultArray.push(c.id));
                            resolve(resultArray);
                        }, (err) => {
                            reject(err);
                        });
                    }
                }, (err) => {
                    reject(err);
                });
            });
        });
    }

    async removeCompany(userId: number, compId: number): Promise<number[]> {
        return await new Promise<number[]>((resolve, reject) => {
            this.userRepository.findOneOrFail(userId, { relations: ['followingCompanies'] }).then((u) => {
                const companyIndex = u.followingCompanies.findIndex((c) => c.id === compId);

                if (companyIndex < 0) {
                    reject(new BadRequestException(`CompanyId ${compId} was not found on user.`));
                } else {
                    u.followingCompanies.splice(companyIndex, 1);

                    const newU = Object.assign(new User(), u);

                    this.userRepository.save(newU).then(() => {
                        let resultArray = [];
                        (u.followingCompanies as Array<any>).forEach((c) => resultArray.push(c.id));
                        resolve(resultArray);
                    }, (err) => {
                        reject(err);
                    });
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    async getPersonalFeed(userId: number): Promise<Case[]> {
        return await new Promise<Case[]>((resolve, reject) => {
            this.userRepository.findOneOrFail(userId, {relations: ['followingCompanies']}).then(async u => {
                let casesOfFollowingCompanies: Case[] = [];
                for (const company of u.followingCompanies) {
                    await this.caseService.getCaseFromCompanyId(company.id).then(cases => {
                        casesOfFollowingCompanies = casesOfFollowingCompanies.concat(cases);
                    });
                }
                resolve(casesOfFollowingCompanies)
            }, (err) => {
                reject(err);
            })
        })
    }

    async getSuggestedCompanies(userId: number): Promise<Company[]> {
        return await new Promise<Company[]>((resolve, reject) => {
            this.userRepository.findOneOrFail(userId, {relations: ['followingCompanies']}).then(u => {
                if (u.followingCompanies.length === 0) {
                    resolve(u.followingCompanies);
                }
                let industries: number[] = [];
                for (const company of u.followingCompanies) {
                    if (!industries.includes(company.industry)) {
                        industries.push(company.industry);
                    }
                }
                this.companyService.getCompaniesByIndustryId(industries).then(async companies => {
                    let followingCompaniesIds = [];
                    (u.followingCompanies as Array<any>).forEach((c) => followingCompaniesIds.push(c.id));
                    let result = companies.filter(c => !followingCompaniesIds.includes(c.id));

                    if (result.length > 4) {
                        result = await this.shuffle(result);
                    }
                    resolve(result.splice(0, 4));
                }, (err) => {
                    reject(err);
                });
            })
        })
    }

    async getSuggestedCases(userId: number): Promise<Case[]> {
        return await new Promise<Case[]>((resolve, reject) => {
            this.getSuggestedCompanies(userId).then(async companies => {
                let suggestedCases: Case[] = [];
                for (const company of companies) {
                    await this.caseService.getCaseFromCompanyId(company.id).then(cases => {
                        suggestedCases = suggestedCases.concat(cases);
                    });
                }
                resolve(suggestedCases);
            }, (err) => {
                reject(err);
            })
        });
    }

    private async shuffle(array: any[]): Promise<any[]> {
        return await new Promise<any[]>((resolve, reject) => {
            try {
                let counter = array.length;
                while (counter > 0) {
                    const index = Math.floor(Math.random() * counter);
                    counter--;
                    const temp = array[counter];
                    array[counter] = array[index];
                    array[index] = temp;
                }
                resolve(array);
            } catch (err) {
                reject(err);
            }
        });
    }
}
