
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';

// services
import { MenuService } from '../../../services/menu.service';
import { ReproductorService } from '../../../services/reproductor.service';
import { CancionService } from '../../services/cancion.service';
import { ListaService } from '../../../lista/services/lista.service';
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { AlertasServices } from '../../../services/alertas.service';
import { CancionListaReproduccionService } from '../../../services/cancionListaReproduccion.service';

// rxjs
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// route
import {Router} from '@angular/router';


@Component({
  selector: 'app-ver-todos',
  templateUrl: './ver-todos.component.html',
  styleUrls: ['./ver-todos.component.css']
})
export class VerTodosComponent implements OnInit {

  debouncer: Subject<number> = new Subject(); 
  cancionSeleccionadaAAgregar!: string;

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
  arrayCanciones!: any[];

  banderaListaReproduccion = {
    mostrar: false
  }
  controlPaginacionListaReproduccion:any = {
    siguientePagina: 1,
    anteriorPagina : 1,
    hasNextPage: false,
    hasPrevPage: false
  };
  arrayListaReproduccion!: any[];

  personaPresente: any;

  @ViewChild('termino') termino!: ElementRef;

  constructor(
    private cancionService: CancionService,
    private alertService: AlertasServices,
    public menuService: MenuService,
    private reproductorService: ReproductorService,
    private listaService: ListaService,
    private usuarioService: UsuarioService,
    private cancionListaReproduccionService: CancionListaReproduccionService,
    private router: Router
  ) {
    this.consultarTodasCanciones(1);
  }

  ngOnInit(): void {
    this.debouncer
    .pipe(debounceTime(500)) // Para emitir despues de 300 milisegundos.
    .subscribe( (numeroPagina) => {
      const termino = this.termino.nativeElement.value
      this.cancionService.consultarCancionesPorTermino(termino, numeroPagina)
      .subscribe({
        next: (res) => {
          if(res == null){
            this.alertService.alertaAdvertercia('No se encontraron Albums');
          }else{
            this.asignarValoreDeRespuestaServicio(res);
            this.banderas.busquedaTermino = true;
          }
        },
        error: () => this.alertService.alertaErrorMs('Error en la petición del servicio')
      })
    });
  }

  consultarTodasCanciones(numeroPagina: number){
    this.cancionService.consultarTodasCanciones(numeroPagina)
    .subscribe({
      next: (res) => this.asignarValoreDeRespuestaServicio(res),
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });
  }

  consultarCancionPorTermino(numeroPagina = 1){
    const termino = this.termino.nativeElement.value;
    if(!!termino || termino !== ""){
      this.debouncer.next(numeroPagina);
    }
  }

  cambiarPagina(numeroPagina: number){
    (this.banderas.busquedaTermino) ? (this.consultarCancionPorTermino(numeroPagina)) : (this.consultarTodasCanciones(numeroPagina));
  }

  limpiarInputSearch(){
    this.banderas.busquedaTermino = false;
    this.termino.nativeElement.value = '';
    this.consultarTodasCanciones(1);
  }


  asignarValoreDeRespuestaServicio(data: any){
    this.arrayCanciones = data.docs;
    this.controlPaginacion.siguientePagina = data.nextPage;
    this.controlPaginacion.anteriorPagina = data.prevPage;
    this.controlPaginacion.hasNextPage = data.hasNextPage;
    this.controlPaginacion.hasPrevPage = data.hasPrevPage;
  }

  eliminarCancion(idCancion: string){
    this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar la Canción', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.cancionService.eliminarCancion(idCancion)
        .subscribe({
          next: () => {
            this.alertService.alertaExito("Canción Eliminado Exitosamente");
            this.consultarTodasCanciones(1);
          },
          error: () => this.alertService.alertaErrorMs('Error en el servicio')
        });
      }
    });
  }

  verMas(idCancion: string){
    const role = this.menuService.getRole;
    (role === "ADMINISTRADOR") ? (this.router.navigate(['/administrador/cancion/verUno', idCancion])) : (this.router.navigate(['/usuario/cancion/verUno', idCancion]));
  }

  cancionAReproducir(cancion: any){
    this.reproductorService.isListaReproduccion = false;
    this.reproductorService.setActivo = true;
    this.reproductorService.cancionSeleccionadaDesdeAlbum(cancion);
  }


  /* Listas  de Reproducción*/

  verListasDeReproduccionPropio(idCancionSeleccionado = ""){

    (this.banderaListaReproduccion.mostrar) 
      ? (this.banderaListaReproduccion.mostrar = false) 

      : ( this.consultarListaDeReproduccionPorUsuario(),
          this.banderaListaReproduccion.mostrar = true,
          this.cancionSeleccionadaAAgregar = idCancionSeleccionado
        );
  }

  consultarListaDeReproduccionPorUsuario(numeroPagina = 1){
    const idUsuario: string = this.usuarioService.getUsuario.id;
    this.listaService.consultarTodosListaPorUsuarios(idUsuario, numeroPagina)
    .subscribe({
      next: (res) => this.asignarValoreDeRespuestaServicioListaReproduccion(res),
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });
  }

  asignarValoreDeRespuestaServicioListaReproduccion(data: any){
    this.arrayListaReproduccion = data.docs;
    this.controlPaginacionListaReproduccion.siguientePagina = data.nextPage;
    this.controlPaginacionListaReproduccion.anteriorPagina = data.prevPage;
    this.controlPaginacionListaReproduccion.hasNextPage = data.hasNextPage;
    this.controlPaginacionListaReproduccion.hasPrevPage = data.hasPrevPage;
  }

  agregarCancionAlistaReproduccion(listaReproduccion: string){
    const data = {
      listaReproduccion,
      cancion: this.cancionSeleccionadaAAgregar
    };

    this.cancionListaReproduccionService.crearCancionListaReproduccion(data)
    .subscribe({
      next: (res: any) => {
        if(res.ok){
          this.alertService.alertaExito('Canción Agregado Exitosamente');
          this.banderaListaReproduccion.mostrar = false;
          this.cancionSeleccionadaAAgregar = "";
        }else{
          const message = res.message.error.mensaje;
          this.alertService.alertaErrorMs(message);
        }  
      },
      error: () => this.alertService.alertaErrorMs('Error en la petición del servicio.')
    });
  }

}