import { User } from './user.model';
import {Case} from './case.model';

export class Company {
  id: string;
  name: string;
  headcount: number;
  revenue: string;
  website: string;
  industry: string;
  headoffice: string;
  description: string;
  disabled: boolean;
  createdBy: User;
  createdAt: string;
  modifiedBy: User;
  modifiedAt: string;
  cases: Case[];
  companySourceId: String;
}

export class SourceCompany {
  companySourceId: string;
  Name: string;
  FullOverview: string;
  OperatingRevenue: string;
  Employees: number;
  NAICECoreCode: string;
  NAICECoreCodeDescription: string;
  Street: string;
  Postcode: string;
  City: string;
  Country: string;
  Website: string;
  Industry: string;
}

export const Industries = [
  {value: 0, name: 'Agriculture, Forestry, Fishing and Hunting'},
  {value: 1, name: 'Mining, Quarrying, and Oil and Gas Extraction'},
  {value: 2, name: 'Utilities'},
  {value: 3, name: 'Construction'},
  {value: 4, name: 'Manufacturing'},
  {value: 5, name: 'Wholesale Trade'},
  {value: 6, name: 'Retail Trade'},
  {value: 7, name: 'Transportation and Warehousing'},
  {value: 8, name: 'Information'},
  {value: 9, name: 'Finance and Insurance'},
  {value: 10, name: 'Real Estate and Rental and Leasing'},
  {value: 11, name: 'Professional, Scientific, and Technical Services'},
  {value: 12, name: 'Management of Companies and Enterprises'},
  {value: 13, name: 'Administrative and Support and Waste Management and Remediation Services'},
  {value: 14, name: 'Educational Services'},
  {value: 15, name: 'Health Care and Social Assistance'},
  {value: 16, name: 'Arts, Entertainment, and Recreation'},
  {value: 17, name: 'Accommodation and Food Services'},
  {value: 18, name: 'Other Services (except Public Administration)'},
  {value: 19, name: 'Public Administration'}
];
