import { Company } from "src/company/model/company.entity";

export class ContributorRaw {
    user_id: number;
    user_mail: string;
    user_firstName: string;
    user_lastName: string;
    user_role: number;
    user_followingCompanies: Company[];
    resourceType: number;
    count: number;
}