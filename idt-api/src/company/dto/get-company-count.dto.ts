import { Company } from "./../model/company.entity";
import { ApiProperty } from '@nestjs/swagger';

export class GetCompanyCountDto extends Company {
    @ApiProperty({
        example: 5,
        description: 'Companys case count.',
    })
    count: number;
}