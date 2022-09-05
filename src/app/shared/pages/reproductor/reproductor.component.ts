import { Component, OnInit } from '@angular/core';

// Servicio
import { ReproductorService } from '../../../services/reproductor.service';
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { UltimaCancionService } from '../../../services/ultimaCancion.service';
import { AlertasServices } from '../../../services/alertas.service';
import { CancionService } from '../../../cancion/services/cancion.service';
import { AdministradorService } from '../../../administrador/services/administrador.service';

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css']
})
export class ReproductorComponent implements OnInit {


  administrador: any;
  minutosCancion = 0;
  segundosCancion = 0;
  duracionTotalCancionEnReproduccion!: number;

  constructor(
    public reproductorService: ReproductorService,
    public usuarioService: UsuarioService,
    public ultimaCancionService: UltimaCancionService,
    public alertasServices: AlertasServices,
    public cancionService: CancionService,
    public administradorService: AdministradorService
    ) {
    }

    ngOnInit(): void {

    this.reproductorService.track.addEventListener('timeupdate', () =>  {

      this.reproductorService.tiempoDeReproduccionPresente = this.reproductorService.track.currentTime * (100 / this.reproductorService.track.duration);
      
      this.minutosCancion =  Math.trunc((this.reproductorService.track.currentTime / 60));
      this.segundosCancion =  Math.trunc(this.reproductorService.track.currentTime - (this.minutosCancion * 60));

    });

    this.reproductorService.track.addEventListener('ended', () => {
      (this.reproductorService.isAutoPlay)  ? (this.reproductorService.playCancion()) : (this.reproductorService.nextSong());
    });
    
    setTimeout(() => {
      this.consultarUltimaCancionReproducida();
    }, 1000);
  }
  
  consultarUltimaCancionReproducida(){

    const idUsuario = this.usuarioService.usuario.id;

    this.ultimaCancionService.getUltimaCancion(idUsuario)
    .subscribe({
      next: (res: any) => {
        if(res.ok === true){
          if(res.data){
            const idUltimaCancion = res.data._id;
            const idCancion = res.data.cancion;

            this.reproductorService.idUltimaCancion = idUltimaCancion;
            this.reproductorService.setActivo = true;
            this.reproductorService.isListaReproduccion = true;
            
            this.reproductorService.cancionSeleccionadaDesdeAlbum(idCancion);
          }else{
            this.consultarCancionAleatorio();
          }
        }else{
          this.alertasServices.alertaErrorMs('Contacte al Administrador');
        }
      }
    });
  }

  consultarCancionAleatorio(){
    this.cancionService.consultarCancionAleatorio()
      .subscribe({
        next: (result: any) => {
          const idUsuario = this.usuarioService.usuario.id;          
          const idCancion = result.data._id;
          this.crearUltimaCancion(idUsuario, idCancion);
        }
      });
  }

  crearUltimaCancion(idUsuario: string, idCancion: string){
    this.ultimaCancionService.crearUltimaCancion(idUsuario, idCancion)
    .subscribe({
      next:() => {
        this.alertasServices.alertaExito('Se creo la ultima cancion por defecto');
      }
    });
  }

  cerrarReproductor(){
    this.reproductorService.setActivo = false;
  }
}

