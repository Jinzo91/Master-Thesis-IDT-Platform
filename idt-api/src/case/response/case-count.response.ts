import { CountResponse } from '../../common/response/count.response';
import { ApiProperty } from '@nestjs/swagger';
import { Case } from '../model/case.entity';

export class CaseCountResponse extends CountResponse<Case[]> {
    @ApiProperty({
        type: Case,
        isArray: true,
    })
    values: Case[];

    @ApiProperty({
        description: 'Count if queried.',
        type: Number,
    })
    count?: number;
}
