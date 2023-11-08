import { FormControl, ValidationErrors } from '@angular/forms';

export class DateValidator {

   static GreaterThanToday(control: FormControl): ValidationErrors | null {
        let today : Date = new Date();

       if (new Date(control.value) < today)
           return { "GreaterThanToday": true };

       return null;
   }
}
