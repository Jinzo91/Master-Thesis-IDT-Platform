import { Injectable, NotImplementedException, InternalServerErrorException } from '@nestjs/common';
import { SearchResultDto } from './model/search-result.dto';
import { CaseService } from './../case/services/case.service';
import { CompanyService } from './../company/company.service';
import { SearchQuery } from './query/search.query';

@Injectable()
export class SearchService {

    constructor(
        private readonly caseService: CaseService,
        private readonly companyService: CompanyService,
    ) { }

    async perform(query: SearchQuery): Promise<SearchResultDto> {
        return await new Promise<SearchResultDto>((resolve, reject) => {
            // Set Standard Entities
            const searchEntities ={
                cases: true,
                companies: true
            };

            // Choose Entities, if a user specifies them
            if (query.entities) {
                searchEntities.cases = query.entities.includes('Cases');
                searchEntities.companies = query.entities.includes('Companies');

                if (!searchEntities.cases && !searchEntities.companies) {
                    searchEntities.cases = true;
                    searchEntities.companies = true;
                }
            }

            // Rejection Handling
            const handleRejection = (p) => {
                return p.catch((err) => {
                    reject(new InternalServerErrorException('There was an error during search.'));
                });
            }
            
            // Main Promises
            Promise.all([
                searchEntities.cases ? this.caseService.search(query.query) : this.emptyPromise(),
                searchEntities.companies ? this.companyService.search(query.query) : this.emptyPromise(),
            ].map(handleRejection)).then((searchRes) => {
                resolve({
                    cases: searchRes[0],
                    companies: searchRes[1],
                })
            }, (err) => {
                console.log(err);
            });
        });
    }

    // Placeholder Promise
    async emptyPromise(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            resolve([{ values: 0 }, { values: 0 }])
        })
    }
}
