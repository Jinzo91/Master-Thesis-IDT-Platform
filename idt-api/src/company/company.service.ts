import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, HttpService } from '@nestjs/common';
import { Repository, DeepPartial, FindManyOptions, Like, FindConditions, FindOneOptions, DeleteResult, MoreThan, In } from 'typeorm';
import { Company } from './model/company.entity';
import { BvDCompany } from './model/BvDCompany';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../user/model/user.entity';
import * as moment from 'moment';
import { CompanyCountResponse } from './response/company-count.response';
import { ListQuery } from './../common/query/list.query';
import { classToClass } from 'class-transformer';
import { File } from './../file/model/file.entity';
import { CaseService } from './../case/services/case.service';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { GetCompanyCountDto } from './dto/get-company-count.dto';
import { resolve } from 'path';
import { rejects } from 'assert';
import { Observable, of, throwError } from 'rxjs';
import { response } from 'express';
import { catchError, map, throwIfEmpty } from 'rxjs/operators';
import { nextTick } from 'process';
import { CreateCompanyDto } from './dto/create-company.dto';
import { IndustryEnum } from './model/industry.enum';
import { IsNumber } from 'class-validator';

@Injectable()
export class CompanyService extends TypeOrmCrudService<Company> {
  constructor(@InjectRepository(Company) repo, private httpService: HttpService) {
    super(repo);
  }

  async replaceAllCompanies(user: User) {
    let companies = await this.repo.find()
    for (let company of companies ) {
      if (company.companySourceId != null) {
        let sourceCompany = await this.findAddableCompanyById(company.companySourceId);
        if (sourceCompany == null) {
          continue;
        }
        let streetLine = sourceCompany.Street == null ? "" : sourceCompany.Street + ", ";
        let postcodeLine = sourceCompany.Postcode == null ? "" : sourceCompany.Postcode + ", ";
        let cityLine = sourceCompany.City == null ? "" : sourceCompany.City + ", ";
        this.performUpdate(company.id, {
          name: sourceCompany.Name, 
          headcount: sourceCompany.Employees,
          website: sourceCompany.Website,
          industry: sourceCompany.Industry == null ? null : IndustryEnum[sourceCompany.Industry] as unknown as number,
          headoffice: streetLine + postcodeLine + cityLine + sourceCompany.Country,
          description: sourceCompany.FullOverview,
          revenue: sourceCompany.OperatingRevenue == null ? null : sourceCompany.OperatingRevenue.toString(),
          companySourceId: sourceCompany.companySourceId,
        }, user);
      } else {
        let searchResults = await this.findAddableCompanyByName(company.name.split("/").join(" "));
        let added = false;
        if (searchResults.length != 0) {
          added = await this.enrichSingleCompany(company, searchResults[0], user);
        }
        if(!added && company.website != "" && company.website != null) {
          let trimmedURL: string = company.website
            .split("https://").join("") //remove https
            .split("http://").join("") //remove http
            .split("/")[0]; //remove everything after / - soll das gemacht werden
          if (!trimmedURL.startsWith("www.")) {
            trimmedURL = "www." + trimmedURL;
          }
          let searchResults = await this.findAddableCompanyByURL(trimmedURL);
          if (searchResults.length != 0) {
            added = searchResults.length != 0 && await this.enrichSingleCompany(company, searchResults[0], user);
          }
        }
      }
    }
  }

  async enrichSingleCompany(company: Company, sourceCompany: BvDCompany, user: User): Promise<boolean> {
    if(sourceCompany.Country != null && sourceCompany.Country != ""  && company.headcount != null && company.headoffice != "") {
      let sameCountry = company.headoffice.toLowerCase().includes(sourceCompany.Country.toLowerCase());
      if (!sameCountry && sourceCompany.Country.toLowerCase().includes('united states')) {
        sameCountry = company.headoffice.toLowerCase().includes('us');
      } else if (!sameCountry && sourceCompany.Country.toLowerCase().includes('united kingdom')) {
        sameCountry = company.headoffice.toLowerCase().includes('uk');
      }
      if (!sameCountry) { return false; }
    }
    console.log(company.name + " gets updated with: " + sourceCompany.Name);
    let streetLine = sourceCompany.Street == null ? "" : sourceCompany.Street + ", ";
    let postcodeLine = sourceCompany.Postcode == null ? "" : sourceCompany.Postcode + ", ";
    let cityLine = sourceCompany.City == null ? "" : sourceCompany.City + ", ";
    this.performUpdate(company.id, {
      name: sourceCompany.Name, 
      headcount: sourceCompany.Employees,
      website: sourceCompany.Website,
      industry: sourceCompany.Industry == null ? null : IndustryEnum[sourceCompany.Industry] as unknown as number,
      headoffice: streetLine + postcodeLine + cityLine + sourceCompany.Country,
      description: sourceCompany.FullOverview,
      revenue: sourceCompany.OperatingRevenue == null ? null : sourceCompany.OperatingRevenue.toString(),
      companySourceId: sourceCompany.companySourceId,
    }, user);
    return true;
  }

  async findAddableCompanyById(id: string): Promise<BvDCompany> {
    return await this.httpService.get<BvDCompany>('https://vmkrcmar102.in.tum.de/company-source/getById/' + id).pipe(
      map(res => res.data),
      catchError(e => of(null))
    ).toPromise();
  }

  async findAddableCompanyByName(name: string): Promise<BvDCompany[]> {
    let emptyArr: BvDCompany[] = [];
    return await this.httpService.get<BvDCompany[]>('https://vmkrcmar102.in.tum.de/company-source/getByName/' + name).pipe(
      map(res => res.data),
      catchError(e => of(emptyArr))
    ).toPromise();
  }

  async findAddableCompanyByURL(url: string): Promise<BvDCompany[]> {
    let emptyArr: BvDCompany[] = [];
    return await this.httpService.get<BvDCompany[]>('https://vmkrcmar102.in.tum.de/company-source/getByURL/' + url).pipe(
      map(res => res.data),
      catchError(e => of(emptyArr))
    ).toPromise();
  }
/*
  async createFromCompanySource(id: string, user: User): Promise<Company> {
    let sourceCompany = (await this.httpService.get<BvDCompany>('http://localhost:4000/company/getByID/' + id)
      .toPromise())
      .data;
    let idtCompany = new CreateCompanyDto(
      sourceCompany.Name,
      sourceCompany.Employees,
      
    )
  }
*/
  async create(attributes: DeepPartial<Company>, user: User): Promise<Company> {
    return await new Promise<Company>((resolve, reject) => {
      attributes.createdBy = user.id;
      const company = Object.assign(new Company(), attributes);
      this.repo.save(company).then((c) => {
        this.repo.findOneOrFail({
          relations: ['createdBy'],
          where: { id: company.id },
        }).then((c) => {
          console.log(c);
          resolve(c);
        }, (err) => {
          console.log(err);
          reject(err);
        });
      }, (err) => {
        if ((err.message as string).includes('UNIQUE KEY')) {
          reject(new BadRequestException(`A Company with the name ${attributes.name} already exists and cannot created a second time.`))
        } else {
          reject(err);
        }
      });
    });
  }

  async getCompanyLogoById(id: string): Promise<File> {
    return await new Promise<File>((resolve, reject) => {
      this.repo.findOneOrFail(id, {
        relations: ['logo'],
      }).then((c) => {
        if (c.logo) {
          const file = Object.assign(new File(), c.logo);
          resolve(file);
        } else {
          reject(new NotFoundException("Image not found."))
        }
      }, (err) => {
        reject(new NotFoundException("No Logo found for this company."));
      });
    });
  }

  async update(id: string, attributes: DeepPartial<Company>, user: User): Promise<Company> {
    return await new Promise<Company>((resolve, reject) => {
      this.repo.findOne(id).then((c) => {
        if (c) {
          resolve(this.performUpdate(parseInt(id, 10), attributes, user));
        } else {
          reject(new NotFoundException('Company not found.'));
        }
      });
    });
  }

  async remove(id: string, user: User): Promise<Company> {
    
    return await new Promise<Company>((resolve, reject) => {
      this.repo.delete(parseInt(id, 10)).then((c) => {
        if (c) {
          resolve();
        } else {
          reject(new NotFoundException('Company not found.'));
        }
      });
    });
  }

  async countRecords(range?: string): Promise<number> {
    let findQuery: FindManyOptions<Company> = {};

    if (range === 'week') {
      findQuery = {
        where: {
          createdAt: MoreThan(moment().subtract(7, "days").startOf("day").toISOString())
        }
      }
    } else {
      findQuery = {}
    }

    return await this.repo.count(findQuery);
  }

  async clean(): Promise<any> {
    return await this.repo.query('DELETE FROM company');
  }

  async search(searchString: string): Promise<Company[]> {
    return await new Promise<Company[]>((resolve, reject) => {
      const findQuery: FindManyOptions<Company> = {
        relations: ['createdBy', 'modifiedBy'],
        cache: true,
      };

      (findQuery.where as Array<FindConditions<Company>>) = [
        {
          name: Like(`%${searchString}%`),
        }
      ];

      this.repo.find(findQuery).then((cases) => {
        resolve(classToClass(cases));
      }, (err) => {
        reject(err);
      });
    });
  }

  async getTopCompanies(amount: number): Promise<GetCompanyCountDto[]> {
    return await new Promise<GetCompanyCountDto[]>((resolve, reject) => {
      this.repo.query(`WITH tempCompanyCount AS (SELECT TOP(${amount}) count([dbo].[company].id) as 'count', [dbo].[company].id FROM [dbo].[case] INNER JOIN [dbo].[company] ON [dbo].[case].companyId=[dbo].[company].id GROUP BY [dbo].[company].id ORDER BY COUNT([dbo].[company].id) DESC) SELECT * FROM tempCompanyCount INNER JOIN [dbo].[company] ON tempCompanyCount.id=[dbo].[company].id;`).then((result) => {
        (result as Array<any>).forEach((p) => p.id = p.id[0]);
        resolve(result);
      }, (err) => {
        reject(err);
      });
    })
  }

  async getProgressCompanies(): Promise<GetCompanyCountDto[]> {
    return await new Promise<GetCompanyCountDto[]>((resolve, reject) => {
        this.repo.query(`SELECT count(*) as 'count', DATENAME(month, MAX(createdAt)) as 'month' from dbo.[company] WHERE createdAt > DATEADD(m, -5, current_timestamp) GROUP BY YEAR(createdAt), MONTH(createdAt) ORDER BY YEAR(createdAt), MONTH(createdAt)`).then((result) => {
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          const today = new Date();
          let currentMonthNumber = (today.getMonth() - 5) % 12;
          for (let i = 0; i < 6; i++) {
              if (result.length <= i || months.indexOf(result[i].month) > currentMonthNumber) {
                  result.splice(i, 0, {count: 0, month: months[currentMonthNumber]});
              }
              currentMonthNumber = (currentMonthNumber + 1) % 12;
          }
          resolve(result);
        }, (err) => {
          reject(err);
        });
    })
  }

  async getNewestCompanies(): Promise<GetCompanyCountDto[]> {
    return await new Promise<GetCompanyCountDto[]>((resolve, reject) => {
      this.repo.query(`SELECT TOP (3) * FROM dbo.[company] WHERE createdAt <= (SELECT MAX(createdAt) FROM dbo.[company]) ORDER BY createdAt DESC`).then(result => {
        resolve(result);
      }, (err) => {
        reject(err);
      })
    })
  }

  async getTodaysCompanyCount(): Promise<number> {
    return await new Promise<number>((resolve, reject) => {
        this.repo.query(`SELECT count(*) as 'count' FROM dbo.[company] WHERE cast(createdAt as Date) = cast(getDate() as Date)`).then(result => {
            resolve(result);
        }, (err) => {
            reject(err);
        })
    })
    }

  async findCompany(compId: number): Promise<Company> {
      return this.repo.findOneOrFail(compId);
  }

  async getCompaniesByIndustryId(technologyIds: number[]): Promise<Company[]> {
    return await new Promise<Company[]>((resolve, reject) => {
      const findQuery: FindManyOptions<Company> = {
        where: [
            {industry: In(technologyIds)}
        ]
      }
      return this.repo.find(findQuery).then(companies => {
        resolve(companies);
      }, (err) => {
        reject(err);
      })
    })
  }

  private async performUpdate(id: number, attributes: DeepPartial<Company>, user: User): Promise<Company> {
    return await new Promise<Company>((resolve, reject) => {
      this.repo.findOneOrFail(id).then((_) => {
        attributes.id = id;
        attributes.modifiedBy = user.id;
        const updateCompany = Object.assign(new Company(), attributes);

        this.repo.save(updateCompany).then(() => {
          this.repo.findOne({
            relations: ['createdBy', 'modifiedBy'],
            where: { id },
          }).then((responseC) => {
            resolve(classToClass(responseC));
          }, (_) => {
            reject(new InternalServerErrorException('Internal Error. Company was updated anyway.'));
          });
        }, (err) => {
          if ((err.message as string).includes('UNIQUE KEY')) {
            reject(new BadRequestException(`A Company with the name ${attributes.name} already exists and cannot created a second time.`))
          } else {
            reject(err);
          }
        });
      }, (_) => {
        reject(new NotFoundException(`Could not update company with id ${id}, because it does not exist.`))
      });
    });
  }
}