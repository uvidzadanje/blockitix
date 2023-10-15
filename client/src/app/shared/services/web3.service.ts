import { Injectable } from '@angular/core';
import { ConstructorFragment, ethers } from 'ethers';
import { AlertService } from '../../components/parts/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export abstract class Web3Service {
  constructor(private alertService: AlertService) { }

  public abstract get Contract() : Promise<ethers.Contract>;

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
      const contract = await this.Contract;

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
      const contract = await this.Contract;

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
      const contract = await this.Contract;

      await contract.on(event, onEventFunction);
    } catch (error: any) {
      this.alertService.alert$.next(error.message);
    }
  }
}
