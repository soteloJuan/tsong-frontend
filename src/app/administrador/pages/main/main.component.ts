import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  bandera: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  clickBandera(){
    (this.bandera)?(this.bandera = false):(this.bandera = true);
  }

}
