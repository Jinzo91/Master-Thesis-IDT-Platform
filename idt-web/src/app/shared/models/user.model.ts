export type Role = 0 | 1;
export class User {
  id: string;
  mail: string;
  firstName: string;
  lastName: string;
  role: Role;
}
