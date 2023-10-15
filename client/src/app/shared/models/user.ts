export enum Role {
  CREATOR,
  BUYER
}

export interface User {
  userAddress: string;
  role: Role;
  fullname: string
}

export interface CreateUser extends Omit<User, "userAddress"> { }
