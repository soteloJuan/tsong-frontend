
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';

// services
import { MenuService } from '../../../services/menu.service';
import { AlbumService } from '../../services/album.service';
import { AlertasServices } from '../../../services/alertas.service';
import { ReproductorService } from '../../../services/reproductor.service';

// rxjs
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Router
import {Router} from '@angular/router';


// interface
import { AlbumInterface } from '../../interfaces/album.interface';

@Component({
  selector: 'app-ver-todos',
  templateUrl: './ver-todos.component.html',
  styleUrls: ['./ver-todos.component.css']
})
export class VerTodosComponent implements OnInit {

  debouncer: Subject<number> = new Subject(); 

  controlPaginacion:any = {
    siguientePagina: 1,
    anteriorPagina : 1,
    hasNextPage: false,
    hasPrevPage: false
  };

  banderas = {
    busquedaTermino: false,
    mostrarFormulario: false
  };

  arrayAlbums!: any[];

  @ViewChild('termino') termino!: ElementRef;

  constructor(
    private albumService: AlbumService,
    private alertService: AlertasServices,
    public menuService: MenuService,
    private router: Router,
    private reproductorService: ReproductorService
  ) {
    this.consultarTodosAlbumsPaginado(1);
  }


  ngOnInit(): void {
    this.debouncer
    .pipe(debounceTime(500)) // Para emitir despues de 300 milisegundos.
    .subscribe( (numeroPagina) => {
      const termino = this.termino.nativeElement.value
      this.albumService.consultarAlbumsPorTermino(termino, numeroPagina) // TODO ESTO PUEDE SER REDUCIDO
      .subscribe(
        (res) => {
          if(res == null){
            this.alertService.alertaAdvertercia('No se encontraron Albums');
          }else{
            this.asignarValoreDeRespuestaServicio(res);
            this.banderas.busquedaTermino = true;
          }
        },
        (error) => {
          this.alertService.alertaErrorMs('Error en la petición del servicio');
        }
      )
    });
  }

  
  consultarTodosAlbumsPaginado(numeroPagina: number){ // aqui vamos
    this.albumService.consultarTodosAlbums(numeroPagina)
    .subscribe(
      (res) => {
        this.asignarValoreDeRespuestaServicio(res);
      },
      (error) => {
        this.alertService.alertaErrorMs('Error en el servicio');
      }
    );
  }

  consultarAlbumPorTermino(numeroPagina = 1){
    const termino = this.termino.nativeElement.value;
    if(!!termino || termino !== ""){
      this.debouncer.next(numeroPagina);
    }
  }

  
  cambiarPagina(numeroPagina: number){
    if(this.banderas.busquedaTermino){
      this.consultarAlbumPorTermino(numeroPagina);
    }else{
      this.consultarTodosAlbumsPaginado(numeroPagina);
    }
  }

  reproducirAlbum(idAlbum: string){
    this.reproductorService.isListaReproduccion = false;
    this.reproductorService.setActivo = true;
    this.reproductorService.albumSeleccionada(idAlbum);

  }

  verUnSoloAlbum(idAlbum: string){
    const role = this.menuService.getRole;
    (role === "ADMINISTRADOR") ? (this.router.navigate(['/administrador/album/verUno', idAlbum])) : (this.router.navigate(['/usuario/album/verUno', idAlbum]));
  }


  eliminarAlbum(idAlbum: string){
    this.alertService.alertaPreguta('Estas seguro', 'Se eliminara el Album', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.albumService.eliminarAlbum(idAlbum)
        .subscribe(
          (res) => {
            this.alertService.alertaExito("Album Eliminado Exitosamente");
            this.consultarTodosAlbumsPaginado(1);
          },
          (error) => {
            this.alertService.alertaErrorMs('Error en el servicio');
          }
        );
      }
    });

}



  limpiarInputSearch(){
    this.banderas.busquedaTermino = false;
    this.termino.nativeElement.value = '';
    this.consultarTodosAlbumsPaginado(1);
  }

  asignarValoreDeRespuestaServicio(data: any){

    this.arrayAlbums = data.docs;
    this.controlPaginacion.siguientePagina = data.nextPage;
    this.controlPaginacion.anteriorPagina = data.prevPage;
    this.controlPaginacion.hasNextPage = data.hasNextPage;
    this.controlPaginacion.hasPrevPage = data.hasPrevPage;
  }


}
