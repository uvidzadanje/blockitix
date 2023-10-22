import { Component, Input, OnInit } from '@angular/core';
import { SeatLayout } from '../seat-generator.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @Input() layout?: SeatLayout;

  constructor() { }

  ngOnInit(): void {
  }

}
