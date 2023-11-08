import { Pipe, PipeTransform } from '@angular/core';
import { ethers } from 'ethers';

@Pipe({
  name: 'ethParser'
})
export class EthParserPipe implements PipeTransform {

  transform(value: number): string {
    return ethers.formatEther(value);
  }

}
