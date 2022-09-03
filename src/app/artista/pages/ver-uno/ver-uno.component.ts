import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';

// Servicios
import { ArtistaService } from '../../services/artista.service';
import { AlbumService } from '../../../album/services/album.service';
import { MenuService } from '../../../services/menu.service';
import {SpinnerService} from '../../../services/spinner.service';
import {CampoValidoService} from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';
import {ReproductorService} from '../../../services/reproductor.service';

// interfaces
import {ArtistaInterface} from '../../interfaces/artista.interface';

// Router
import {Router, ActivatedRoute} from '@angular/router';


//rxjs
import { switchMap, tap } from 'rxjs/operators';

// Formularios
import {FormGroup, Validators, FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-ver-uno',
  templateUrl: './ver-uno.component.html',
  styleUrls: ['./ver-uno.component.css']
})
export class VerUnoComponent implements OnInit {

  artista!: ArtistaInterface;
  arrayAlbums: any;
  formArtista: FormGroup = this.fb.group({});


  valoresNoValidos = ['null', null, undefined, ''];
  imagenASubir!: File;
  imagenTemporal: any;

  banderas = {
    agregarFoto :   true,
    cancelarFoto:   false,
    guardarFoto :   false,
    eliminarFoto:   false,
    mostrarFormularioUpdateDataArtista: false,
  };

  controlPaginacion:any = {
    siguientePagina: 0,
    anteriorPagina : 0,
    hasNextPage: false,
    hasPrevPage: false
  };

  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;


  constructor(
    private activatedRoute: ActivatedRoute,
    public artistaService: ArtistaService,
    private albumService: AlbumService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    private campoValido: CampoValidoService,
    private alertService: AlertasServices,
    public menuService: MenuService,
    private router: Router,
    private reproductorService: ReproductorService
  ) { 
    this.crearFormularioArtista();
  }

  ngOnInit(): void {
    this.activateRouteConsulta();
  }



  activateRouteConsulta(){

    this.activatedRoute.params.pipe(
      switchMap( ({idArtista}) => this.artistaService.consultarArtistasPorId(idArtista)),
      tap( (resArtistaService: any) => {
        this.artista = this.artistaService.convertirAArtistaInterface(resArtistaService.data);
      }),
    ).subscribe({
      next: () => {
        this.consultarAlbumsPorArtistaPaginado(1);
        this.formatoDate();
      }
    });
  }

  consultarAlbumsPorArtistaPaginado(pagina = 1){
    this.albumService.consultarAlbumsPorIdArtistaPaginado(this.artista.id, pagina)
    .subscribe({
      next: (res: any) => res.data && this.asignarValoreDeRespuestaServicio(res.data)
    });
  }

  asignarValoreDeRespuestaServicio(data: any){
    this.arrayAlbums = data.docs;
    this.controlPaginacion.siguientePagina = data.nextPage;
    this.controlPaginacion.anteriorPagina = data.prevPage;
    this.controlPaginacion.hasNextPage = data.hasNextPage;
    this.controlPaginacion.hasPrevPage = data.hasPrevPage;
  }

  mostrarFormularioActualizarData(){
    (this.banderas.mostrarFormularioUpdateDataArtista)
      ? ( this.banderas.mostrarFormularioUpdateDataArtista = false) 
      : (
          this.campoValido.miFormulario = this.formArtista,
          this.banderas.mostrarFormularioUpdateDataArtista = true,
          this.resetFormularioArtista()
        )
  }

  
  esCampoValido(campo: string) : Boolean{ return this.campoValido.esValidoCampo(campo) }


  crearFormularioArtista(){
    this.formArtista = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      pais: [0, [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      descripcion: [ '', Validators.required],
      bloqueado: ['', [Validators.required, Boolean]]
    });
  }

  resetFormularioArtista(){
  
    this.formArtista.reset({
      nombre: this.artista.nombre,
      pais: this.artista.pais,
      fechaInicio: this.artista.fechaInicio,
      descripcion: this.artista.descripcion,
      bloqueado: this.artista.bloqueado
    });
  
  }

  guardarCambiosArtistaModificado(){

    if ( this.formArtista.invalid )  {
      this.formArtista.markAllAsTouched(); 
      return;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.artistaService.actualizarDatosBasicosArtista( this.artista.id, this.formArtista.value)
        .subscribe({
          next: (res: any) => {
            if(res.ok){
              this.alertService.alertaExito('Se realizaron los cambios de manera exitosa');
              this.mostrarFormularioActualizarData();
              this.activateRouteConsulta();
            }else{
              const message: string = res.message.error.mensaje;
              this.alertService.alertaErrorMs(message);
            }
          },
          error: () => this.alertService.alertaErrorMs('Error en la petición del servicio.')
        });
      }
    });
  }
  
  formatoDate(){
    const newFormat: any = this.artista.fechaInicio.split('T', 1);
    this.artista.fechaInicio = newFormat[0];
  }
  
  /* IMAGEN */
  
  seleccionarImagen(){

    this.imagenASubir = this.inputChangeIMG.nativeElement.files[0];
    const file = this.inputChangeIMG.nativeElement.files[0];
    const arrayValorerFileName = file.type.split('/');
    const extension  = arrayValorerFileName[1];
    const extensionesValidas = ['png', 'jng' , 'jpeg', 'gif', 'jpg'];
    
    if(!file) return ;


    if(!extensionesValidas.includes(extension)){
      this.alertService.alertaErrorMs('Archivo no permitido');
      return ;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { this.imagenTemporal = reader.result; };
    this.banderas.cancelarFoto = true;
    this.banderas.guardarFoto = true;
    this.banderas.agregarFoto = false;

  }

  cancelarFotoSeleccionado(){

    this.imagenTemporal        = null;
    this.banderas.cancelarFoto = false;
    this.banderas.guardarFoto  = false;
    this.banderas.agregarFoto  = true;
  }

  guardarFoto(){
    if(!this.imagenASubir) return ;
        
    this.spinnerService.setSpinner = true;
    this.artistaService.guardarImagenArtista(this.imagenASubir, this.artista.id).subscribe({
      next: () => {
        this.spinnerService.setSpinner = false;
        this.alertService.alertaExito('Imagen Guardado exitosamente');
        this.activateRouteConsulta();
      },
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });

    this.cancelarFotoSeleccionado();
  }

  
  eliminarFoto(){
    const imagenURL = this.artista.imagenURL;

    if(this.valoresNoValidos.includes(imagenURL)){
      this.alertService.alertaAdvertercia('¡ Esta cuenta no tiene una Imagen que eliminar !');
      return ;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar la foto', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.artistaService.eliminarImagenArtista(this.artista.id)
        .subscribe({
          next: () => {
            this.alertService.alertaExito('Se elimino exitosamente');
            this.activateRouteConsulta();
          },
          error: () => this.alertService.alertaErrorMs('Error en el servicio')
        });
      }
    });
  }

  albumAReproducir(idAlbum: string) {
    this.reproductorService.setActivo = true;
    this.reproductorService.albumSeleccionada(idAlbum);
  }

  verMasDelAlbum(idAlbum: string){
    const role = this.menuService.getRole;
    (role === "ADMINISTRADOR") ? (this.router.navigate(['/administrador/album/verUno', idAlbum])) : (this.router.navigate(['/usuario/album/verUno', idAlbum]));
  }

  eliminarAlbum(idAlbum: string){
    this.alertService.alertaPreguta('Estas seguro', 'Se eliminara el Album', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.albumService.eliminarAlbum(idAlbum)
        .subscribe({
          next: () => {
            this.alertService.alertaExito("Album Eliminado Exitosamente");
            this.consultarAlbumsPorArtistaPaginado(1);
          },
          error: () => this.alertService.alertaErrorMs('Error en el servicio')
        });
      }
    });
  }
}