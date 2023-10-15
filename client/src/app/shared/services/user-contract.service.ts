import { Injectable } from '@angular/core';
import { Contract } from 'ethers';
import { AlertService } from 'src/app/components/parts/alert/alert.service';
import { environment } from 'src/environments/environment';
import { Web3Service } from './web3.service';

@Injectable({
  providedIn: 'root'
})
export class UserContractService extends Web3Service {
  public get Contract(): Promise<Contract> {
    return this.createEthereumContract(environment.userContractAddress, environment.userABI);
  }

  constructor(alertService: AlertService) {
    super(alertService);
  }
}
