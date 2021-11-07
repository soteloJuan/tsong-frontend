import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

// Servicio
import { ReproductorService } from '../../../services/reproductor.service';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent implements OnInit {


  minutosCancion: number = 0;
  segundosCancion: number = 0;
  duracionTotalCancionEnReproduccion!: number;

  constructor(
    public reproductorService: ReproductorService,
    private render2: Renderer2
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

/***   VAMOS CON EL VOLUMEN DE LA CANCION Y TABIEN VAMOS CON LO QUE ES EL QUE CONTINUE CON LA SIGUIENTE CANCION CUANDO SE TERMINE DE REPRODUCIR */
