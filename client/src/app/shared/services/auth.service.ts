import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/components/parts/alert/alert.service';
import { CreateUser, User } from '../models/user';
import { UserContractService } from './user-contract.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authInfo$: Subject<User> = new Subject<User>();
  authInfo: User | null = null;

  constructor(private userContractService: UserContractService, private alertService: AlertService)
  {
    this.authInfo$.subscribe(user => {
      this.authInfo = user;
    })
  }

  async isAuthenticated()
  {
    let user = await this.getUser();

    console.log(user?.userAddress);

    console.log(user?.userAddress !== ethers.ZeroAddress)

    return user?.userAddress !== ethers.ZeroAddress;
  }

  async getUser()
  {
    let user = await this.userContractService.execute<User>("getUser");

    return user;
  }

  async register(user: CreateUser)
  {
    console.log(user);
    try {
      return await this.userContractService.execute("create", user.role, user.fullname);
    } catch (error: any) {
      this.alertService.alert$.next(error.message);
    }
  }
}
