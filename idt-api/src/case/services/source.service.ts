import { Injectable, BadRequestException } from "@nestjs/common";
import { Source } from "../model/source.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeepPartial } from "typeorm";
import { Case } from "../model/case.entity";
import { File } from "./../../file/model/file.entity";

@Injectable()
export class SourceService {

    constructor(
        @InjectRepository(Source)
        private readonly sourceRepository: Repository<Source>,

        @InjectRepository(Case)
        private readonly caseRepository: Repository<Case>,
    ) { }

    async create(caseId: string, attributes: DeepPartial<Source>): Promise<Source> {
        return await new Promise<Source>((resolve, reject) => {
            this.caseRepository.findOneOrFail(caseId).then((c) => {

                // Check if file is empty object
                if (attributes.file) {
                    if (Object.entries(attributes.file).length === 0 && attributes.file.constructor === Object) {
                        attributes.file = null;
                    }
                }
                
                attributes.case = c;
                const source = Object.assign(new Source(), attributes);

                this.sourceRepository.save(source).then((s) => {
                    // Set hasSources to true
                    c.hasSources = true;
                    const newCase = Object.assign(new Case(), c);

                    this.caseRepository.save(newCase).then((cc) => {
                        this.sourceRepository.findOne(s.id, { relations: ['file'] }).then((ss) => {
                            resolve(ss);
                        }, (err) => {
                            reject(err);
                        });
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
    }

    async update(caseId: string, sourceId: string, attributes: DeepPartial<Source>): Promise<Source> {
        return await new Promise<Source>((resolve, reject) => {
            this.caseRepository.findOneOrFail(caseId).then((c) => {
                this.sourceRepository.update(sourceId, attributes).then((s) => {
                    this.sourceRepository.findOne(sourceId, { relations: ['file'] }).then((ss) => {
                        resolve(ss);
                    }, (err) => {
                        reject(err);
                    });
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    deleteSourceById(caseId: string, sourceId: string) {
        let attributes: DeepPartial<Source> = {};
        return new Promise<any>((resolve, reject) => {
            this.sourceRepository.find({
                relations: ['file'],
                where: { case: caseId }
            }).then((ss) => {
                const index = ss.findIndex((elem) => elem['id'] === parseInt(sourceId))
                this.sourceRepository.remove(ss[index]).then((r) => {
                    this.getSourcesOfCase(caseId).then((ss) => {
                        resolve(ss);
                    }, (err) => {
                        reject(err);
                    });
                }, (err) => {
                    reject(err);
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    async getSourceFileById(id: string): Promise<File> {
        return await new Promise<File>((resolve, reject) => {
            this.sourceRepository.findOneOrFail(id, {
                relations: ['file'],
            }).then((s) => {
                const file = Object.assign(new File(), s.file);
                resolve(file);
            }, (err) => {
                reject(err);
            });
        });
    }

    async getSourcesOfCase(caseId: string): Promise<Source[]> {
        return await new Promise<Source[]>((resolve, reject) => {
            this.sourceRepository.find({
                relations: ['file'],
                where: { case: caseId }
            }).then((ss) => {
                resolve(ss);
            }, (err) => {
                reject(err);
            });
        });
    }

    async clean(): Promise<any> {
        return await this.sourceRepository.query('DELETE FROM [source]');
    }
}