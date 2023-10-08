import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alert$: Subject<string> = new Subject<string>();
  constructor() { }
}
