import { Component, OnInit } from '@angular/core';

// Servicio
import { ReproductorService } from '../../../services/reproductor.service';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent implements OnInit {


  minutosCancion = 0;
  segundosCancion = 0;
  duracionTotalCancionEnReproduccion!: number;

  constructor(
    public reproductorService: ReproductorService
    ) { }

  ngOnInit(): void {
  
    this.reproductorService.consultarUltimaCancionReproducida();

    this.reproductorService.track.addEventListener('timeupdate', () =>  {

      this.reproductorService.tiempoDeReproduccionPresente = this.reproductorService.track.currentTime * (100 / this.reproductorService.track.duration);
      
      this.minutosCancion =  Math.trunc((this.reproductorService.track.currentTime / 60));
      this.segundosCancion =  Math.trunc(this.reproductorService.track.currentTime - (this.minutosCancion * 60));
      
    });

    this.reproductorService.track.addEventListener('ended', () => {
      (this.reproductorService.isAutoPlay)  ? (this.reproductorService.playCancion()) : (this.reproductorService.nextSong())
    });

  }



  cerrarReproductor(){
    this.reproductorService.setActivo = false;
  }

}