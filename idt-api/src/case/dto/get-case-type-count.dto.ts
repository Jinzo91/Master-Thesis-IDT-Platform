import { ApiProperty } from '@nestjs/swagger';
import { CaseTypeEnum } from "../model/case-type.enum";

export class GetCaseTypeCount {
    @ApiProperty({
        example: 5,
        description: 'CaseType ENUM.',
        enum: CaseTypeEnum
    })
    caseType: number;

    @ApiProperty({
        example: 5,
        description: 'CaseType count.',
    })
    count: number;
}