import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Case } from '../model/case.entity';
import { Repository, DeepPartial, FindManyOptions, FindConditions, Like, FindOneOptions, LessThan, MoreThan, DeleteResult } from 'typeorm';
import { User } from '../../user/model/user.entity';
import { ListQuery } from '../../common/query/list.query';
import { CountResponse } from '../../common/response/count.response';
import { classToClass } from 'class-transformer';
import * as moment from 'moment';
import { File } from './../../file/model/file.entity';
import { Technology } from '../model/technology.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { GetTechnologyCountDto } from '../dto/get-technology-count.dto';
import { GetCaseTypeCount } from '../dto/get-case-type-count.dto';
import { Comment } from '../model/comment.entity';
import { rejects } from 'assert';
import { RoleEnum } from './../../user/model/role.enum';

@Injectable()
export class CaseService extends TypeOrmCrudService<Case> {

    constructor(
        @InjectRepository(Case) repo,

        @InjectRepository(Technology)
        private readonly technologyRepository: Repository<Technology>,

        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>
    ) {
        super(repo);
    }

    async create(attributes: DeepPartial<Case>, user: User): Promise<Case> {
        return await new Promise<Case>((resolve, reject) => {
            attributes.createdBy = user.id;
            const newCase = Object.assign(new Case(), attributes);

            this.repo.save(newCase).then((c) => {
                this.repo.findOne({
                    relations: ['createdBy', 'company', 'technologies'],
                    where: { id: c.id },
                }).then((cDto) => {
                    resolve(cDto);
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    async getAllFeatured(): Promise<CountResponse<Case[]>> {
        return await new Promise<CountResponse<Case[]>>((resolve, reject) => {
            const findQuery: FindManyOptions<Case> = {
                relations: ['createdBy', 'modifiedBy', 'company', 'technologies'],
                cache: true,
                take: 5,
                order: { modifiedAt: 'DESC', createdAt: 'DESC' },
                where: { featured: true }
            };

            this.repo.findAndCount(findQuery).then((c) => {
                resolve({ values: classToClass(c[0]), count: c[1] });
            }, (err) => {
                reject(err);
            });
        });
    }

    async getWeeklyCases(): Promise<CountResponse<Case[]>> {
        return await new Promise<CountResponse<Case[]>>((resolve, reject) => {
            const dateBoundary = moment().subtract(7, 'days').toDate();

            const findQuery: FindManyOptions<Case> = {
                relations: ['createdBy', 'modifiedBy', 'company', 'technologies'],
                cache: true,
                take: 5,
                order: { modifiedAt: 'DESC', createdAt: 'DESC' },
                where: [
                    { createdAt: MoreThan(dateBoundary) }
                ]
            };

            this.repo.findAndCount(findQuery).then((c) => {
                resolve({ values: classToClass(c[0]), count: c[1] });
            }, (err) => {
                reject(err);
            });
        });
    }

    async getCaseImageById(id: string): Promise<File> {
        return await new Promise<File>((resolve, reject) => {
            this.repo.findOneOrFail(id, {
                relations: ['image'],
            }).then((c) => {
                if (c.image) {
                    const file = Object.assign(new File(), c.image);
                    resolve(file);
                } else {
                    reject(new NotFoundException("No case image found."));
                }
            }, (err) => {
                reject(err);
            });
        });
    }

    async getCaseFromCompanyId(companyId: number): Promise<Case[]> {
        return await new Promise<Case[]>((resolve, reject) => {
            const findQuery: FindManyOptions<Case> = {
                relations: ['createdBy', 'modifiedBy', 'company', 'technologies'],
                where: [
                    {company: companyId}
                ]
            }
            this.repo.find(findQuery).then((cc) => {
                resolve(cc);
            }, (err) => {
                reject(err);
            });
        });
    }

    async addTechnology(caseId: string, attributes: DeepPartial<Technology>, user: User): Promise<Technology> {
        return await new Promise<Technology>((resolve, reject) => {
            this.technologyRepository.findOneOrFail(attributes.id ? attributes.id : 0).then((t) => {
                this.repo.findOneOrFail(caseId, { relations: ['technologies'] }).then((c) => {
                    const foundItem = c.technologies.find((p) => p.id === attributes.id);

                    if (foundItem) {
                        reject(new BadRequestException("Technology already exists on this case."));
                    } else {
                        c.technologies.push(t);

                        c.modifiedBy = user.id;
                        const newC = Object.assign(new Case(), c);

                        this.repo.save(newC).then((cc) => {
                            resolve(t);
                        }, (err) => {
                            reject(err);
                        });
                    }
                }, (err) => {
                    reject(err);
                });
            }, (_) => {
                const technology = Object.assign(new Technology(), attributes);
                this.technologyRepository.save(technology).then((tt) => {
                    this.repo.findOneOrFail(caseId, { relations: ['technologies'] }).then((c) => {
                        c.technologies.push(tt);

                        c.modifiedBy = user.id;
                        const newC = Object.assign(new Case(), c);

                        this.repo.save(newC).then((cc) => {
                            resolve(tt);
                        }, (err) => {
                            reject(err);
                        });
                    }, (err) => {
                        reject(err);
                    })
                }, (err) => {
                    reject(err);
                });
            });
        });
    }

    async removeTechnology(caseId: string, techId: string, user: User): Promise<Case> {
        return await new Promise<Case>((resolve, reject) => {
            this.repo.findOneOrFail(caseId, { relations: ['technologies'] }).then((c) => {
                let techIndex = c.technologies.findIndex((t) => t.id === parseInt(techId, 10));

                if (techIndex < 0) {
                    reject(new BadRequestException(`TechId ${techId} was not found on caseId ${caseId}.`));
                } else {
                    c.technologies.splice(techIndex, 1);

                    c.modifiedBy = user.id;
                    const newC = Object.assign(new Case(), c);

                    this.repo.save(newC).then((cc) => {
                        this.repo.findOne({
                            relations: ['createdBy', 'modifiedBy', 'company', 'technologies'],
                            where: { id: c.id },
                        }).then((cDto) => {
                            resolve(cDto);
                        }, (err) => {
                            reject(err);
                        });
                    }, (err) => {
                        reject(err);
                    });
                }

            }, (err) => {
                reject(err);
            });
        });
    }

    async suggestTechnology(caseId: string): Promise<Technology[]> {
        return await new Promise<Technology[]>((resolve, reject) => {
            if (caseId) {
                this.repo.findOneOrFail(caseId, { relations: ['technologies'] }).then((cc) => {
                    this.technologyRepository.find().then((tt) => {
                        cc.technologies.forEach((ct) => {
                            let index = tt.findIndex((t) => t.id === ct.id);
                            tt.splice(index, 1);
                        });

                        resolve(tt);
                    }, (err) => {
                        reject(err);
                    });
                }, (err) => {
                    reject(err);
                });
            } else {
                this.technologyRepository.find().then((tt) => {
                    resolve(tt);
                }, (err) => {
                    reject(err);
                });
            }
        });
    }

    async getCaseComments(caseId: string): Promise<Comment[]> {
        return await new Promise<Comment[]>((resolve, reject) => {
            const findQuery: FindManyOptions<Comment> = {
                relations: ['createdBy'],
                where: {
                    case: caseId
                },
                order: {
                    createdAt: 'DESC'
                }
            };

            this.commentRepository.find(findQuery).then(result => {
                resolve(result);
            }, (err) => {
                reject(err);
            })
        });
    }

    async createCaseComment(caseId: string, attributes: DeepPartial<Comment>, user: User): Promise<Comment> {
        return await new Promise<Comment>((resolve, reject) => {
            this.repo.findOneOrFail(caseId).then((c) => {
                attributes.case = c;
                attributes.createdBy = user;
                attributes.createdAt = new Date().toString();
                const comment = Object.assign(new Comment(), attributes);

                this.commentRepository.save(comment).then((com) => {

                    const newC = Object.assign(new Case(), c);

                    this.repo.save(newC).then((cc) => {
                        resolve(com);
                    }, (err) => {
                        reject(err);
                    });
                }, (err) => {
                    reject(err);
                });
            });
        });
    }

    async editCaseComment(commentId: string, attributes: DeepPartial<Comment>, user:User): Promise<Comment> {
        return await new Promise<Comment>((resolve, reject) => {
            this.commentRepository.findOneOrFail(commentId, {relations: ['createdBy']}).then(c => {
                if (user.role !== RoleEnum.Admin && c.createdBy.id !== user.id) {
                    reject('You are not allowed to edit this case.')
                } else {
                    c.comment = attributes.comment;

                    this.commentRepository.save(c).then(cc => {
                        resolve(cc);
                    })
                }
            }, (err) => {
                reject(err);
            })
        })
    }

    async deleteCaseComment(commentId: string, user: User): Promise<DeleteResult> {
        return await new Promise<DeleteResult>((resolve, reject) => {
            this.commentRepository.findOneOrFail(commentId, {relations: ['createdBy']}).then(c => {
                if (user.role !== RoleEnum.Admin && c.createdBy.id !== user.id) {
                    reject('You are not allowed to delete this case.')
                } else {
                    this.commentRepository.delete(c).then(result => {
                        resolve(result);
                    }, (err) => {
                        reject(err);
                    });
                }
            }, (err) => {
                reject(err);
            })
        })
    }


    async update(id: string, attributes: DeepPartial<Case>, user: User): Promise<Case> {
        return await new Promise<Case>((resolve, reject) => {
            this.repo.findOne(id).then((c) => {
                if (c) {
                    resolve(this.performUpdate(parseInt(id, 10), attributes, user));
                } else {
                    reject(new NotFoundException('Case not found.'));
                }
            });
        });
    }

    async countRecords(range?: string): Promise<number> {
        let findQuery: FindManyOptions<Case> = {};

        if (range === 'week') {
            findQuery = {
                where: {
                    createdAt: MoreThan(moment().subtract(7, "days").startOf("day").toISOString())
                }
            }
        } else {
            findQuery = {}
        }

        return await this.repo.count(findQuery);
    }

    async remove(id: string, user: User): Promise<Case> {
        return await new Promise<Case>((resolve, reject) => {
            this.repo.delete(parseInt(id, 10)).then((c) => {
                if (c) {
                    resolve();
                } else {
                    reject(new NotFoundException('Case not found.'));
                }
            });
        });
    }

    async clean(): Promise<any> {
        return await this.repo.query('DELETE FROM [case]');
    }

    async cleanTech(): Promise<any> {
        return await this.technologyRepository.query('DELETE FROM [technology]');
    }

    async search(searchString: string): Promise<Case[]> {
        return await new Promise<Case[]>((resolve, reject) => {
            const findQuery: FindManyOptions<Case> = {
                relations: ['createdBy', 'modifiedBy', 'company', 'technologies'],
                cache: true,
            };

            (findQuery.where as Array<FindConditions<Case>>) = [
                {
                    title: Like(`%${searchString}%`),
                },
                {
                    description: Like(`%${searchString}%`),
                },
            ];

            this.repo.find(findQuery).then((cases) => {
                resolve(classToClass(cases));
            }, (err) => {
                reject(err);
            });
        });
    }

    async getTopTechs(amount: number): Promise<GetTechnologyCountDto[]> {
        return await new Promise<GetTechnologyCountDto[]>((resolve, reject) => {
            this.repo.query(`WITH tempTechCount AS (SELECT TOP(${amount}) count([dbo].[case_technologies_technology].technologyId) as 'count', [dbo].[case_technologies_technology].technologyId from dbo.case_technologies_technology GROUP BY [dbo].[case_technologies_technology].technologyId ORDER BY COUNT([dbo].[case_technologies_technology].technologyId) DESC) SELECT * FROM tempTechCount INNER JOIN [dbo].[technology] ON tempTechCount.technologyId=[dbo].[technology].id;`).then((result) => {
                (result as Array<any>).forEach((p) => delete p.technologyId);
                resolve(result);
            }, (err) => {
                reject(err);
            });
        })
    }

    async getCaseTypeCounts(): Promise<GetCaseTypeCount[]> {
        return await new Promise<GetCaseTypeCount[]>((resolve, reject) => {
            this.repo.query(`select count([dbo].[case].caseType) as 'count', [dbo].[case].caseType from dbo.[case] GROUP BY [dbo].[case].caseType ORDER BY COUNT([dbo].[case].caseType) DESC;`).then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        })
    }

    async getProgressCases(): Promise<GetCaseTypeCount[]> {
        return await new Promise<GetCaseTypeCount[]>((resolve, reject) => {
            this.repo.query(`SELECT count(*) as 'count', DATENAME(month, MAX(createdAt)) as 'month' from dbo.[case] WHERE createdAt > DATEADD(m, -5, current_timestamp) GROUP BY YEAR(createdAt), MONTH(createdAt) ORDER BY YEAR(createdAt), MONTH(createdAt)`).then((result) => {
                const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                const today = new Date();
                let currentMonthNumber = (today.getMonth() - 5) % 12;
                for (let i = 0; i < 6; i++) {
                    if (result.length <= i || months.indexOf(result[i].month) > currentMonthNumber) {
                        result.splice(i, 0, {count: 0, month: months[currentMonthNumber]});
                    }
                    currentMonthNumber = (currentMonthNumber + 1) % 12;
                }
                resolve(result);
            }, (err) => {
                reject(err);
            });
        })
    }

    async getTodaysCaseCount(): Promise<number> {
        return await new Promise<number>((resolve, reject) => {
            this.repo.query(`SELECT count(*) as 'count' FROM dbo.[case] WHERE cast(createdAt as Date) = cast(getDate() as Date)`).then(result => {
                resolve(result);
            }, (err) => {
                reject(err);
            })
        })
        }

    async getTrendingTechnologies(): Promise<GetTechnologyCountDto[]> {
        return await new Promise<GetTechnologyCountDto[]>((resolve, reject) => {
            this.repo.query(`WITH tempTechs AS (SELECT * FROM dbo.case_technologies_technology), tempRecentTechs AS (SELECT TOP (3) count(technologyId) as 'count', technologyId FROM tempTechs INNER JOIN [dbo].[case] ON tempTechs.caseId=[dbo].[case].id WHERE createdAt > DATEADD(d, -14, current_timestamp) GROUP BY technologyId ORDER BY count DESC) SELECT count, name FROM tempRecentTechs INNER JOIN [dbo].[technology] ON tempRecentTechs.technologyId=[dbo].[technology].id`).then(result => {
                resolve(result);
            }, (err) => {
                reject(err);
            })
        })
    }

    private async performUpdate(id: number, attributes: DeepPartial<Case>, user: User): Promise<Case> {
        return await new Promise<Case>((resolve, reject) => {
            this.repo.findOneOrFail(id).then((_) => {
                attributes.id = id;
                attributes.modifiedBy = user.id;
                const updateCase = Object.assign(new Case(), attributes);

                this.repo.save(updateCase).then(() => {
                    this.repo.findOne({
                        relations: ['createdBy', 'modifiedBy', 'company', 'technologies'],
                        where: { id },
                    }).then((c) => {
                        resolve(classToClass(c));
                    }, (_) => {
                        reject(new InternalServerErrorException('Internal Error. Case was updated anyway.'));
                    });
                }, (err) => {
                    reject(err);
                });
            }, (_) => {
                reject(new NotFoundException(`Could not update case with id ${id}, because it does not exist.`))
            });
        });
    }

    async getUserCaseCount(userId: number): Promise<any[]> {
        return await new Promise<any[]>((resolve, reject) => {
            this.repo.query(`SELECT count(*) as 'count' FROM dbo.[case] WHERE createdById=${userId}`).then(result => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
        });
    }
}
