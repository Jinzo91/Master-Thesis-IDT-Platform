import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Request } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './../user/model/user.entity';

@Injectable()
export class CleanUserInterceptor implements NestInterceptor {
  mockUser: User;

  constructor() {
    this.mockUser = {
      firstName: 'Anonymous',
      lastName: 'IDT User',
      id: null,
      mail: null,
      password: null,
      role: null,
      hashPassword: null,
      followingCompanies: null
    };

    this.removeEmpty(this.mockUser);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();

    if (req.headers['authorization'] || req.method !== 'GET') {
      return next.handle();
    } else {
      return next.handle().pipe(map(data => {
        if (data.values && (data.values as Array<any>).length > 0) {
          (data.values as Array<any>).map((v) => {
            v = this.stripUsers(v);
          });
        } else if (data.cases || data.companies) {
          if (data.cases && (data.cases as Array<any>).length > 0) {
            (data.cases as Array<any>).map((v) => {
              v = this.stripUsers(v);
            });
          }

          if (data.companies && (data.companies as Array<any>).length > 0) {
            (data.companies as Array<any>).map((v) => {
              v = this.stripUsers(v);
            });
          }
        }

        data = this.stripUsers(data);

        return data;
      }));
    }
  }

  private stripUsers(data) {
    if (data.createdBy) {
      data.createdBy = this.mockUser;
    }

    if (data.modifiedBy) {
      data.modifiedBy = this.mockUser;
    }

    return data;
  }

  private removeEmpty(obj) {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
  };
}
