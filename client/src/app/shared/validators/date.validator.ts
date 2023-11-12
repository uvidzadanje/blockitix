import { FormControl, ValidationErrors } from '@angular/forms';

export class DateValidator {

   static GreaterThanToday(control: FormControl): ValidationErrors | null {
      let today : Date = new Date();
      let datetime: Date = new Date(control.value)

      if (datetime < new Date(today))
          return { "GreaterThanToday": true };

      return null;
   }
}
