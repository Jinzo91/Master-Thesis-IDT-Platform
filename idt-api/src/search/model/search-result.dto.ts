import { Company } from "./../../company/model/company.entity";
import { Case } from "./../../case/model/case.entity";
import { ApiProperty } from '@nestjs/swagger';

export class SearchResultDto {
    @ApiProperty({
        description: 'All Companies which matches search query.',
        type: Company,
        isArray: true
    })
    companies: Company[];

    @ApiProperty({
        description: 'All Cases which matches search query.',
        type: Case,
        isArray: true
    })
    cases: Case[];
}