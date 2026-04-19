// export interface User {
//   id?: number;
//   username?: string | null;
//   email?: string | null;
//   password?: string | null;
//   passwordRep?: string | null;
//   roleId?: number;
// }

export interface Address {
  id?: number;
  street?: string;
  zip?: string;
  place?: string;
}

export enum USER_TYPE {
  ADMIN = 1,
  USER = 2,
}

export interface Auth0ResponseProfile {
  nickname?: string;
  name?: string;
  picture?: string;
  updated_at?: string;
  email?: string;
  email_verified?: boolean;
  sub?: string;
}

export const AUTH_DATA = 'auth_data';
