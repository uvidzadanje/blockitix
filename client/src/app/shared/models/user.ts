export enum Role {
  CREATOR,
  BUYER
}

export interface User {
  address: string;
  role: Role;
  username: string
}

export interface CreateUser extends Omit<User, "address"> { }
