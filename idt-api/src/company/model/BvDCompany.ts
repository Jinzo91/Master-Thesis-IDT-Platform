import { IndustryEnum } from "./industry.enum";

export class BvDCompany {
    Name: string;
    FullOverview: string;
    OperatingRevenue: number;
    Employees: number;
    NAICECoreCode: string;
    NAICECoreCodeDescription: string;
    BvDSector: string;
    Street: string;
    Postcode: string;
    City: string;
    Country: string;
    Website: string;
    companySourceId: string;
    Industry: IndustryEnum;
  }