import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Servicios
import { ArtistaService } from '../../../artista/services/artista.service';
import { CancionService } from '../../../cancion/services/cancion.service';
import { AlbumService } from '../../services/album.service';
import { MenuService } from '../../../services/menu.service';
import { SpinnerService } from '../../../services/spinner.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';
import {ReproductorService} from '../../../services/reproductor.service';

// interfaces
import { AlbumInterface } from '../../interfaces/album.interface';
import { ArtistaInterface } from '../../../artista/interfaces/artista.interface';

// Router
import { Router, ActivatedRoute } from '@angular/router';

//rxjs
import { switchMap, map } from 'rxjs/operators';

// Formularios
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ver-uno',
  templateUrl: './ver-uno.component.html',
  styleUrls: ['./ver-uno.component.css']
})
export class VerUnoComponent implements OnInit {

  artista!: ArtistaInterface;
  album!: AlbumInterface;
  arrayCanciones: any;
  arrayArtistas: any;
  formAlbum: FormGroup = this.fb.group({});

  valoresNoValidos = ['null', null, undefined, ''];
  imagenASubir!: File;
  imagenTemporal: any;

  banderas = {
    agregarFoto: true,
    cancelarFoto: false,
    guardarFoto: false,
    eliminarFoto: false,
    mostrarFormularioUpdateDataArtista: false,
  };

  controlPaginacion: any = {
    siguientePagina: 0,
    anteriorPagina: 0,
    hasNextPage: false,
    hasPrevPage: false
  };

  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    public artistaService: ArtistaService,
    private albumService: AlbumService,
    private cancionService: CancionService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    private campoValido: CampoValidoService,
    private alertService: AlertasServices,
    public menuService: MenuService,
    private router: Router,
    private reproductorService: ReproductorService
  ) {
    this.crearFormularioAlbum();
  }

  ngOnInit(): void {
    this.activateRouteConsulta();
  }

  activateRouteConsulta() {

    this.activatedRoute.params.pipe(
      switchMap(({ idAlbum }) => this.albumService.consultarAlbumPorId(idAlbum)),
      map((resAlbumService) => {
        this.album = this.albumService.convertirAAlbumInterface(resAlbumService.data);
        return this.album.artista;
      }),
      switchMap((idArtista) => this.artistaService.consultarArtistasPorId(idArtista))
    ).subscribe({
      next: (res: any) => {
        this.artista = this.artistaService.convertirAArtistaInterface(res.data);
        this.consultarCancionPorAlbumPaginado(1);
        this.formatoDate();
      }
    });
  }

  consultarTodosArtistas() {
    this.artistaService.consultarTodosArtistasSinFiltro()
      .subscribe({
        next: (res: any) => {
          (res.ok) ? (this.asignarDatosArtistasConsultados(res.data)) : (this.alertService.alertaErrorMs('Error en el servicio'));
        },
        error: () => this.alertService.alertaErrorMs('Error en la petición del servicio.')
      });
  }

  asignarDatosArtistasConsultados(data: any) {
    this.arrayArtistas = data;
    this.arrayArtistas = this.arrayArtistas.filter((artista: any) => artista._id !== this.artista.id);
  }

  consultarCancionPorAlbumPaginado(pagina = 1) {
    this.arrayCanciones = [];
    this.cancionService.consultarCancionesPorAlbumPaginado(this.album.id, pagina)
      .subscribe({
        next: (res: any) => (res.data) ? (this.asignarValoreDeRespuestaServicio(res.data)) : (this.arrayCanciones = [])
      });
  }

  asignarValoreDeRespuestaServicio(data: any) {
    this.arrayCanciones = data.docs;
    this.controlPaginacion.siguientePagina = data.nextPage;
    this.controlPaginacion.anteriorPagina = data.prevPage;
    this.controlPaginacion.hasNextPage = data.hasNextPage;
    this.controlPaginacion.hasPrevPage = data.hasPrevPage;
  }

  formatoDate() {
    const newFormat: any = this.album.fechaLanzamiento.split('T', 1);
    this.album.fechaLanzamiento = newFormat[0];
  }

  /* IMAGEN */
  seleccionarImagen() {

    this.imagenASubir = this.inputChangeIMG.nativeElement.files[0];
    const file = this.inputChangeIMG.nativeElement.files[0];
    const arrayValorerFileName = file.type.split('/');
    const extension = arrayValorerFileName[1];
    const extensionesValidas = ['png', 'jng', 'jpeg', 'gif', 'jpg'];

    if (!file) return;

    if (!extensionesValidas.includes(extension)) {
      this.alertService.alertaErrorMs('Archivo no permitido');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { this.imagenTemporal = reader.result; };
    this.banderas.cancelarFoto = true;
    this.banderas.guardarFoto = true;
    this.banderas.agregarFoto = false;
  }

  cancelarFotoSeleccionado() {
    this.imagenTemporal = null;
    this.banderas.cancelarFoto = false;
    this.banderas.guardarFoto = false;
    this.banderas.agregarFoto = true;
  }

  guardarFoto() {
    if (!this.imagenASubir) return;

    this.spinnerService.setSpinner = true;
    this.albumService.guardarImagenAlbum(this.imagenASubir, this.album.id)
    .subscribe({
      next: () => {
        this.spinnerService.setSpinner = false;
        this.alertService.alertaExito('Imagen Guardado exitosamente');
        this.activateRouteConsulta();
      },
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });
    this.cancelarFotoSeleccionado();
  }

  eliminarFoto() {
    const imagenURL = this.album.imagenURL;

    if (this.valoresNoValidos.includes(imagenURL)) {
      this.alertService.alertaAdvertercia('¡ Esta cuenta no tiene una Imagen que eliminar !');
      return;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar la foto', 'si')
      .then((result) => {
        if (result.isConfirmed) {
          this.albumService.eliminarAlbum(this.album.id).subscribe({
            next: () => {
              this.alertService.alertaExito('Se elimino exitosamente');
              this.activateRouteConsulta();
            },
            error: () => this.alertService.alertaErrorMs('Error en el servicio')
          });
        }
      });
  }

  albumAReproducir(idCancion: string) {
    this.reproductorService.isListaReproduccion = false;
    this.reproductorService.setActivo = true;
    this.reproductorService.cancionSeleccionadaDesdeAlbum(idCancion);
  }

  verMasDelCancion(idCancion: string) {
    const role = this.menuService.getRole;
    (role === "ADMINISTRADOR") ? (this.router.navigate(['/administrador/cancion/verUno', idCancion])) : (this.router.navigate(['/usuario/cancion/verUno', idCancion]));
  }

  eliminarCancion(idCancion: string) {
    this.alertService.alertaPreguta('Estas seguro', 'Se eliminara la Canción', 'si')
      .then((result) => {
        if (result.isConfirmed) {
          this.cancionService.eliminarCancion(idCancion)
            .subscribe({
              next: () => {
                this.alertService.alertaExito("Canción Eliminado Exitosamente");
                this.consultarCancionPorAlbumPaginado(1);
              },
              error: () => this.alertService.alertaErrorMs('Error en el servicio')
            });
        }
      });
  }

  // Formulario

  mostrarFormularioActualizarData() {
    if (this.banderas.mostrarFormularioUpdateDataArtista) {
      this.banderas.mostrarFormularioUpdateDataArtista = false;
    } else {
      this.campoValido.miFormulario = this.formAlbum;
      this.banderas.mostrarFormularioUpdateDataArtista = true;
      this.consultarTodosArtistas();
      this.resetFormularioAlbum();
    }
  }

  esCampoValido(campo: string): Boolean { return this.campoValido.esValidoCampo(campo) }

  crearFormularioAlbum() {
    this.formAlbum = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      artista: ['', [Validators.required]],
      fechaLanzamiento: ['', [Validators.required]],
      descripcion: ['', Validators.required],
      bloqueado: ['', [Validators.required, Boolean]]
    });
  }

  resetFormularioAlbum() {
    this.formAlbum.reset({
      nombre: this.album.nombre,
      artista: this.artista.id,
      fechaLanzamiento: this.album.fechaLanzamiento,
      descripcion: this.album.descripcion,
      bloqueado: this.album.bloqueado
    });
  }

  guardarCambiosAlbumModificado() {

    if (this.formAlbum.invalid) {
      this.formAlbum.markAllAsTouched();
      return;
    }
    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
      .then((result) => {
        if (result.isConfirmed) {
          this.albumService.actualizarDatosBasicosAlbum(this.album.id, this.formAlbum.value)
          .subscribe({
            next: (res: any) => {
              if (res.ok) {
                this.alertService.alertaExito('Se realizaron los cambios de manera exitosa');
                this.mostrarFormularioActualizarData();
                this.activateRouteConsulta();
              } else {
                const message: string = res.message.error.mensaje;
                this.alertService.alertaErrorMs(message);
              }
            },
            error: () => this.alertService.alertaErrorMs('Error en la petición del servicio.')
          });
        }
      });
  }

  verArtista(idArtista: string){
    const role = this.menuService.getRole;
    (role === "ADMINISTRADOR") ? (this.router.navigate(['/administrador/artista/verUno', idArtista])) : (this.router.navigate(['/usuario/artista/verUno', idArtista]));
  }

}
