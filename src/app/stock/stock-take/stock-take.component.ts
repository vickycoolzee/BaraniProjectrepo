import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-take',
  templateUrl: './stock-take.component.html',
  styleUrls: ['./stock-take.component.css']
})
export class StockTakeComponent implements OnInit {
  classapplied = false

  constructor() { }

  ngOnInit(): void {
  }
  action(){
    this.classapplied = !this.classapplied
   }

}
