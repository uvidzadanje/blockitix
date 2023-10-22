import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';

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
  width: number;
  height: number;
  top: number;
  left: number;
}

@Component({
  selector: 'app-seat-generator',
  templateUrl: './seat-generator.component.html',
  styleUrls: ['./seat-generator.component.css'],
})
export class SeatGeneratorComponent implements OnInit {
  layoutForm: FormGroup = new FormGroup({
    rows: new FormControl(1, [Validators.required, Validators.min(1)]),
    columns: new FormControl(1, [Validators.required, Validators.min(1)]),
    name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    type: new FormControl(null, [Validators.required]),
  });
  typeForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    color: new FormControl(null, [Validators.required]),
    price: new FormControl(null, [Validators.required, Validators.min(0.01)]),
  });
  layouts: SeatLayout[] = [];
  types: SeatType[] = [];
  constructor() {}

  ngOnInit(): void {
    this.layouts.push({
      rows: 10,
      columns: 10,
      name: 'test',
      type: { name: 'nesto', color: '#ff0000', price: 1 },
      width: 10 * 40,
      height: 10 * 40,
      top: 0,
      left: 0,
    });
  }

  addLayout(formLayoutDirective: FormGroupDirective) {
    this.layouts.push({
      ...this.layoutForm.value,
      type: this.types[this.layoutForm.value.type],
      width: this.layoutForm.value.columns * 40,
      height: this.layoutForm.value.rows * 40,
      top: 0,
      left: 0,
    });
    formLayoutDirective.resetForm({ rows: 1, columns: 1 });
  }

  addType(formTypeDirective: FormGroupDirective) {
    this.types.push({ ...this.typeForm.value });
    formTypeDirective.resetForm({ color: '#000000' });
  }

  removeType(index: number) {
    let type = { ...this.types[index] };
    this.layouts = this.layouts.filter(
      (layout) => layout.type.name !== type.name
    );
    this.types.splice(index, 1);
  }

  setNewPosition(event: Event, index: number) {
    let element = event.target as HTMLElement;
    this.layouts[index].width = +element.style.getPropertyValue('--width').replace("px", "");
    this.layouts[index].height = +element.style.getPropertyValue('--height').replace("px", "");
    this.layouts[index].top = +element.style.getPropertyValue('--top').replace("px", "");
    this.layouts[index].left = +element.style.getPropertyValue('--left').replace("px", "");
  }

  removeLayout(index: number) {
    this.layouts.splice(index, 1);
  }
}
