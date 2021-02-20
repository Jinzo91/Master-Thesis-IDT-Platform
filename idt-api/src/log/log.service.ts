import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './model/log.entity';
import { Repository, DeepPartial } from 'typeorm';
import { HttpMethodEnum } from './model/http-method.enum';
import { EventEnum } from './model/event.enum';
import { User } from './../user/model/user.entity';
import { LogTypeEnum } from './model/log-type.enum';
import { ContributorRaw } from './dto/contributor.raw';
import { UserService } from './../user/user.service';
import { ContributorDto } from './dto/contributor.dto';
import { DateQuery } from 'src/reporting/query/date.query';
import { ResourceType } from './model/resource-type.enum';


@Injectable()
export class LogService {

    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) { }

    async logRequest(
        httpMethod: string,
        resource: string,
        leadTime: number,
        user?: User
    ) {
        this.log(
            this.getHttpMethod(httpMethod),
            resource,
            this.getEventType(httpMethod, resource),
            LogTypeEnum.request,
            this.getResourceType(resource),
            leadTime,
            true,
            user
        );
    }

    async logError(
        httpMethod: string,
        resource: string,
        user?: User
    ) {
        this.log(
            this.getHttpMethod(httpMethod),
            resource,
            this.getEventType(httpMethod, resource),
            LogTypeEnum.request,
            this.getResourceType(resource),
            null,
            false,
            user
        );
    }

    async getContributors(query: DateQuery): Promise<ContributorDto[]> {
        return await new Promise<ContributorDto[]>((resolve, reject) => {
            this.logRepository.createQueryBuilder("log")
                .leftJoin("log.user", "user")
                .select('user.firstName')
                .addSelect('user.lastName')
                .addSelect('user.mail')
                .addSelect('user.id')
                .addSelect('user.role')
                .addSelect('log.resourceType as "resourceType"')
                .addSelect('count(*) as "count"')
                .where("log.httpMethod = :enum", { enum: 1 })
                .andWhere("log.userId IS NOT NULL")
                .andWhere("log.success = 1")
                .andWhere("log.timestamp BETWEEN :start AND :end", { start: query.start, end: query.end })
                .groupBy('log.resourceType')
                .addGroupBy('user.firstName')
                .addGroupBy('user.lastName')
                .addGroupBy('user.mail')
                .addGroupBy('user.id')
                .addGroupBy('user.role')
                .getRawMany()
                .then((raw: ContributorRaw[]) => {

                    let mapped: ContributorDto[] = raw.map((c) => {
                        let m: ContributorDto = {
                            count: c.count,
                            resource: ResourceType[c.resourceType],
                            user: {
                                id: c.user_id,
                                firstName: c.user_firstName,
                                lastName: c.user_lastName,
                                mail: c.user_mail,
                                role: c.user_role,
                                followingCompanies: c.user_followingCompanies
                            }
                        };

                        return m;
                    })

                    resolve(mapped);
                }, (err) => {
                    reject(err);
                });
        });
    }

    private async log(
        httpMethod: HttpMethodEnum,
        resource: string,
        event: EventEnum,
        logType: LogTypeEnum,
        resourceType: ResourceType,
        leadTime: number,
        success: boolean,
        user?: User
    ) {
        const attributes: DeepPartial<Log> = {
            httpMethod,
            resource,
            event,
            logType,
            success,
            leadTime,
            resourceType
        }

        if (user) {
            attributes.user = user.id;
        }

        const log = Object.assign(new Log(), attributes);
        await this.logRepository.save(log);
    }

    private getHttpMethod(method: string): HttpMethodEnum {
        switch (method) {
            case 'GET':
                return HttpMethodEnum.GET;
            case 'POST':
                return HttpMethodEnum.POST;
            case 'PATCH':
                return HttpMethodEnum.PATCH;
            case 'PUT':
                return HttpMethodEnum.PUT;
            case 'DELETE':
                return HttpMethodEnum.DELETE;
            default:
                return HttpMethodEnum.UNDEFINED;
        }
    }

    private getEventType(method: string, resource: string): EventEnum {
        switch (method) {
            case 'GET':
                if (/\d/.test(resource)) {
                    return EventEnum.READ;
                } else {
                    return EventEnum.LIST;
                }
            case 'POST':
                return EventEnum.CREATE;
            case 'PATCH':
                if (resource.includes('enable')) {
                    return EventEnum.ENABLE;
                } else {
                    return EventEnum.UPDATE;
                }
            case 'PUT':
                return EventEnum.UPDATE;
            case 'DELETE':
                return EventEnum.DELETE;
            default:
                return EventEnum.OTHER;
        }
    }

    private getResourceType(resource: string): ResourceType {
        if (resource.includes('/auth')) {
            return ResourceType.auth;
        } else if (resource.includes('/signup')) {
            return ResourceType.signup;
        } else if (resource.includes('/companies')) {
            return ResourceType.companies;
        } else if (resource.includes('/details')) {
            return ResourceType.details;
        } else if (resource.includes('/cases')) {
            return ResourceType.cases;
        } else if (resource.includes('/landing')) {
            return ResourceType.landing;
        } else if (resource.includes('reporting')) {
            return ResourceType.reporting;
        } else if (resource.includes('search')) {
            return ResourceType.search;
        } else {
            return ResourceType.other;
        }
    }
}
