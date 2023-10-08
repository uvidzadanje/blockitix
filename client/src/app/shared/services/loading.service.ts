import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading$: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  enableLoading()
  {
    this.loading$.next(true);
  }

  disableLoading()
  {
    this.loading$.next(false);
  }
}
