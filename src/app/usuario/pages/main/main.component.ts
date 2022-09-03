import { Component } from '@angular/core';

//Services
import {ReproductorService} from '../../../services/reproductor.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent{

  bandera = false;

  constructor(public reproductorService: ReproductorService) { }

  clickBandera(){
    (this.bandera)?(this.bandera = false):(this.bandera = true);
  }

  abrirReproductor(){
    this.reproductorService.setActivo = true;
  }

}
