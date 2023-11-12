import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BlockitixContractService } from '../shared/services/blockitix-contract.service';
import { EventService } from '../shared/services/event.service';

@Injectable({
  providedIn: 'root'
})
export class EventAuthGuardService implements CanActivate {

  constructor(private eventService: EventService, private blockitixContractService: BlockitixContractService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let event = await this.eventService.getOneEvent(BigInt(+(route.paramMap.get("id") as string)));

    if(!event)
    {
      this.router.navigate([""]);
      return false;
    }

    let signer = await this.blockitixContractService.getSigner();
    let address = await signer.getAddress();

    if(event?.owner !== address)
    {
      this.router.navigate(["register"]);
      return false;
    }

    return true;
  }
}
