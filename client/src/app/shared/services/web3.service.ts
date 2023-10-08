import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../components/parts/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  constructor(private alertService: AlertService) { }

  async createBlockitixEthereumContract() {
    return await this.createEthereumContract(environment.blockitixContractAddress, environment.blockitixAbi);
  };

  async createUserEthereumContract() {
    return await this.createEthereumContract(environment.userContractAddress, environment.userABI);
  }

  async createEthereumContract(address: string, abi: any)
  {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(address, abi, signer);

    return transactionsContract;
  }

  async execute<Type>(method: string, ...args: any[]) : Promise<Type | null>
  {
    try {
      const contract = await this.createBlockitixEthereumContract();

      const data = await contract.getFunction(method)(...args);

      return data as Type;
    } catch (error: any) {
      this.alertService.alert$.next(error.message);
      return null;
    }
  }

  async executeWithOptions<Type>(method: string, options: { value: any }, args: any[] = []) : Promise<Type | null>
  {
    try {
      const contract = await this.createBlockitixEthereumContract();

      const data = await contract.getFunction(method)(...args, {
        value: ethers.parseEther(options.value)
      });

      return data as Type;
    } catch (error: any) {
      this.alertService.alert$.next(error.message);
      return null;
    }
  }

  async onEvent(event:string, onEventFunction: (...args: any) => any)
  {
    try {
      const contract = await this.createBlockitixEthereumContract();

      await contract.on(event, onEventFunction);
    } catch (error: any) {
      this.alertService.alert$.next(error.message);
    }
  }
}
