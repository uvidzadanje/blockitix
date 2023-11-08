import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/components/parts/alert/alert.service';
import { environment } from 'src/environments/environment';
import { CreateUser, User } from '../models/user';
import { fetchResult } from '../utils/fetch.helper';
import { BlockitixContractService } from './blockitix-contract.service';
import { UserContractService } from './user-contract.service';

const AUTH_BASE_URL = `${environment.authServiceURL}/auth`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authInfo$: Subject<User> = new Subject<User>();
  authInfo: User | null = null;

  constructor(private alertService: AlertService, private blockitixContractService: BlockitixContractService)
  {
    this.authInfo$.subscribe(user => {
      this.authInfo = user;
    })
  }

  async isAuthenticated()
  {
    let user = await this.getUser();

    return !!user;
  }

  async getUser(): Promise<User | null>
  {
    try {
      let signer = await this.blockitixContractService.getSigner();
      let address = await signer.getAddress();
      let user = await fetchResult(`${AUTH_BASE_URL}/${address}`, {
        method: "GET"
      });

      if(!user.success) throw new Error("User is not registered");

      return user.data;
    } catch (error) {
      return null;
    }
  }

  async register(user: CreateUser)
  {
    console.log(user);
    try {
      let signer = await this.blockitixContractService.getSigner();
      let address = await signer.getAddress();

      return await fetchResult(`${AUTH_BASE_URL}/register`, {
        method: "POST",
        payload: {...user, address}
      });
    } catch (error: any) {
      this.alertService.alert$.next(error.message);
    }
  }
}
