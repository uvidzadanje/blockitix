import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

export interface SeatType {
  price: number;
  name: string;
  color: string;
}

export interface SeatLayout {
  type: SeatType;
  rows: number;
  columns: number;
  name: string;
}

@Component({
  selector: 'app-seat-generator',
  templateUrl: './seat-generator.component.html',
  styleUrls: ['./seat-generator.component.css']
})
export class SeatGeneratorComponent implements OnInit {
  layoutForm: FormGroup = new FormGroup({
    rows: new FormControl(1, [Validators.required, Validators.min(1)]),
    columns: new FormControl(1, [Validators.required, Validators.min(1)]),
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    type: new FormControl(null, [Validators.required])
  })
  typeForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    color: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(0.01)])
  })
  layouts: SeatLayout[] = [];
  types: SeatType[] = [];
  constructor() { }

  ngOnInit(): void {
    this.layouts.push({rows: 10, columns: 10, name: "test", type: {name: "nesto", color: "#ff0000", price: 1}});
  }

  addLayout(formLayoutDirective: FormGroupDirective)
  {
    this.layouts.push({...this.layoutForm.value, type: this.types[this.layoutForm.value.type]});
    // this.layoutForm.reset();
    formLayoutDirective.resetForm({rows: 1, columns: 1});
  }

  addType(formTypeDirective: FormGroupDirective)
  {
    this.types.push({...this.typeForm.value});
    formTypeDirective.resetForm({color: "#000000"});
  }

  removeType(index: number)
  {
    let type = {...this.types[index]};
    this.layouts = this.layouts.filter(layout => layout.type.name !== type.name);
    this.types.splice(index, 1);
  }

  setNewPosition(event: Event) {
    console.log(event.target);
  }

  removeLayout(index: number) {
    this.layouts.splice(index, 1);
  }
}
