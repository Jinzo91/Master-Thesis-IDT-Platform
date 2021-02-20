import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { CountsDto } from './dto/counts.dto';
import { CaseService } from '../case/services/case.service';
import { CaseCountResponse } from './../case/response/case-count.response';
import { FileService } from './../file/file.service';

@Injectable()
export class LandingService {

    constructor(
        private companyService: CompanyService,
        private caseService: CaseService,
        private fileService: FileService
    ) { }

    async getCounts(): Promise<CountsDto> {
        return await new Promise<CountsDto>((resolve, reject) => {
            this.companyService.countRecords().then((companies) => {
                this.caseService.countRecords().then((cases) => {
                    this.fileService.count().then((files) => {
                        resolve({ companies, cases, files });
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

    async getWeeklyCounts(): Promise<CountsDto> {
        return await new Promise<CountsDto>((resolve, reject) => {
            this.companyService.countRecords("week").then((companies) => {
                this.caseService.countRecords("week").then((cases) => {
                    this.fileService.count("week").then((files) => {
                        resolve({ companies, cases, files });
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

    async getFeaturedCases(): Promise<CaseCountResponse> {
        return await new Promise<CaseCountResponse>((resolve) => {
            resolve(this.caseService.getAllFeatured());
        });
    }
}
