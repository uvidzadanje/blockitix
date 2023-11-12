import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alert$: Subject<{type: "error" | "success", message: string}> = new Subject<{type: "error" | "success", message: string}>();
  constructor() { }
}
