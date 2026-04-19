export interface User {
  id?: number;
  username?: string | null;
  email?: string | null;
  password?: string | null;
  passwordRep?: string | null;
  roleId?: number;
}