import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// services
import { ListaService } from '../../services/lista.service';
import { AlertasServices } from '../../../services/alertas.service';
import { UsuarioService } from '../../../usuario/services/usuario.service';

// rxjs
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Routes
import {Router} from '@angular/router';
import { ReproductorService } from '../../../services/reproductor.service';

@Component({
  selector: 'app-ver-listas-propios',
  templateUrl: './ver-listas-propios.component.html',
  styleUrls: ['./ver-listas-propios.component.css']
})
export class VerListasPropiosComponent implements OnInit {


  debouncer: Subject<number> = new Subject();

  controlPaginacion: any = {
    siguientePagina: 1,
    anteriorPagina: 1,
    hasNextPage: false,
    hasPrevPage: false
  };

  banderas = {
    busquedaTermino: false,
    mostrarFormulario: false
  };

  arrayListas!: any[];

  @ViewChild('termino') termino!: ElementRef;

  constructor(
    private listaService: ListaService,
    private alertService: AlertasServices,
    private usuarioService: UsuarioService,
    private router: Router,
    private reproductorService: ReproductorService
  ) {
  }

  ngOnInit(): void {
    const SetTimeout = setTimeout(() => {
      this.consultarTodosListasPorUsuario(1);
    }, 500);
    SetTimeout;

    this.debouncer
      .pipe(debounceTime(500)) // Para emitir despues de 500 milisegundos.
      .subscribe((numeroPagina) => {
        const termino = this.termino.nativeElement.value
        this.listaService.consultarListaPorTermino(this.usuarioService.getUsuario.id, termino, numeroPagina)
          .subscribe({
          next: (res) => {
            if (res == null) {
              this.alertService.alertaAdvertercia('No se encontraron Listas de Reproducción');
            } else {
              this.asignarValoreDeRespuestaServicio(res);
              this.banderas.busquedaTermino = true;
            }
          },
            error: () => this.alertService.alertaErrorMs('Error en la petición del servicio')
        })
    });
  }

  consultarTodosListasPorUsuario(numeroPagina: number) {
    this.listaService.consultarTodosListaPorUsuarios(this.usuarioService.getUsuario.id, numeroPagina)
    .subscribe({
      next: (res) => (res) && this.asignarValoreDeRespuestaServicio(res),
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });
  }

  consultarListaPorTermino(numeroPagina = 1) {
    const termino = this.termino.nativeElement.value;
    if (!!termino || termino !== "") this.debouncer.next(numeroPagina);
  }

  cambiarPagina(numeroPagina: number) {
    (this.banderas.busquedaTermino) ? (this.consultarListaPorTermino(numeroPagina)) :(this.consultarTodosListasPorUsuario(numeroPagina))
  }

  limpiarInputSearch() {
    this.banderas.busquedaTermino = false;
    this.termino.nativeElement.value = '';
    this.consultarTodosListasPorUsuario(1);
  }

  asignarValoreDeRespuestaServicio(data: any) {
    this.arrayListas = data.docs;
    this.controlPaginacion.siguientePagina = data.nextPage;
    this.controlPaginacion.anteriorPagina = data.prevPage;
    this.controlPaginacion.hasNextPage = data.hasNextPage;
    this.controlPaginacion.hasPrevPage = data.hasPrevPage;
  }

  reproducirListaReproduccion(idLista: string){
    this.reproductorService.isListaReproduccion = true;
    this.reproductorService.setActivo = true;
    this.reproductorService.listaSeleccionada(idLista);
  }

  verMasListaReproduccion(idListaReproduccion: string){
    this.router.navigate(['usuario/lista/verUno', idListaReproduccion]);
  }

  eliminarListaReproduccion(idListaReproduccion: string){
    this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar la Lista Reproducción', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.listaService.eliminarListaReproduccionPropio(idListaReproduccion)
        .subscribe({
          next: () => {
            this.alertService.alertaExito("Lista Reproducción Eliminado Exitosamente");
            this.consultarTodosListasPorUsuario(1);
          },
          error: () => this.alertService.alertaErrorMs('Error en el servicio')
        });
      }
    });
  }
}
