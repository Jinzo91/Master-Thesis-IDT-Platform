import { CountResponse } from '../../common/response/count.response';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../model/company.entity';

export class CompanyCountResponse extends CountResponse<Company[]> {
    @ApiProperty({
        type: Company,
        isArray: true
    })
    values: Company[];

    @ApiProperty({
        description: 'Count if queried.',
        type: Number,
    })
    count?: number;
}
