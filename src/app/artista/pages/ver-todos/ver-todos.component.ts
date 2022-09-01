
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';

// services
import { MenuService } from '../../../services/menu.service';
import { ArtistaService } from '../../services/artista.service';
import { AlertasServices } from '../../../services/alertas.service';

// rxjs
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Router
import {Router} from '@angular/router';

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

  arrayArtistas!: any[];

  @ViewChild('termino') termino!: ElementRef;

  constructor(
    private artistaService: ArtistaService,
    private alertService: AlertasServices,
    private router: Router,
    public menuService: MenuService,
  ) { 
    this.consultarTodosArtistas(1);
  }

  ngOnInit(): void {
    this.debouncer
    .pipe(debounceTime(500)) // Para emitir despues de 300 milisegundos.
    .subscribe( (numeroPagina) => {
      const termino = this.termino.nativeElement.value
      this.artistaService.consultarArtistasPorTermino(termino, numeroPagina)
      .subscribe({
        next: (res) => {
          if(res == null){
            this.alertService.alertaAdvertercia('No se encontraron Artisas');
          }else{
            this.asignarValoreDeRespuestaServicio(res);
            this.banderas.busquedaTermino = true;
          }
        },
        error: () => this.alertService.alertaErrorMs('Error en la petición del servicio')
      })
    });
  }

  consultarTodosArtistas(numeroPagina: number){
    this.artistaService.consultarTodosArtistas(numeroPagina)
    .subscribe({
      next: (res) => this.asignarValoreDeRespuestaServicio(res),
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });
  }

  consultarArtistaPorTermino(numeroPagina = 1){
    const termino = this.termino.nativeElement.value;
    if(!!termino || termino !== "")this.debouncer.next(numeroPagina);
  }

  cambiarPagina(numeroPagina: number){
    (this.banderas.busquedaTermino) ? (this.consultarArtistaPorTermino(numeroPagina)) : (this.consultarTodosArtistas(numeroPagina));
  }

  verUnSoloArtista(idArtista: string){
    const role = this.menuService.getRole;
    (role === "ADMINISTRADOR") ? (this.router.navigate(['/administrador/artista/verUno', idArtista])) : (this.router.navigate(['/usuario/artista/verUno', idArtista]));
  }


  eliminarArtista(idAdministrador: string){
    this.alertService.alertaPreguta('Estas seguro', 'Se eliminara al Arstista', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.artistaService.eliminarArtista(idAdministrador)
        .subscribe({
          next: () => {
            this.alertService.alertaExito("Administrador Eliminado Exitosamente");
            this.consultarTodosArtistas(1);
          },
          error: () => this.alertService.alertaErrorMs('Error en el servicio')
        });
      }
    });
  }

  limpiarInputSearch(){
    this.banderas.busquedaTermino = false;
    this.termino.nativeElement.value = '';
    this.consultarTodosArtistas(1);
  }

  asignarValoreDeRespuestaServicio(data: any){

    this.arrayArtistas = data.docs;
    this.controlPaginacion.siguientePagina = data.nextPage;
    this.controlPaginacion.anteriorPagina = data.prevPage;
    this.controlPaginacion.hasNextPage = data.hasNextPage;
    this.controlPaginacion.hasPrevPage = data.hasPrevPage;
  }


}
