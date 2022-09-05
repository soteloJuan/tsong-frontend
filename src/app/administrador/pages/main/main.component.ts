import { Component, OnInit } from '@angular/core';


// servicios
import { ReproductorService } from '../../../services/reproductor.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  bandera = false;

  constructor(public reproductorService: ReproductorService) { 
  }

  ngOnInit(): void {
  }

  clickBandera(){
    (this.bandera)?(this.bandera = false):(this.bandera = true);
  }

  abrirReproductor(){
    this.reproductorService.setActivo = true;
  }




}
