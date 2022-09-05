import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


// Servicios
import { CancionService } from '../../services/cancion.service';
import { ArtistaService } from '../../../artista/services/artista.service';
import { AlbumService } from '../../../album/services/album.service';
import { MenuService } from '../../../services/menu.service';
import {ValidadoresService} from '../../../services/validadores.service';
import {SpinnerService} from '../../../services/spinner.service';
import {CampoValidoService} from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';

// Router
import {Router, ActivatedRoute} from '@angular/router';


//rxjs
import { switchMap, tap, map } from 'rxjs/operators';

// Formularios
import {FormGroup, Validators, FormBuilder} from '@angular/forms';


// interfaces
import { CancionInterface } from '../../interfaces/cancion.interface';
import { ArtistaInterface } from '../../../artista/interfaces/artista.interface';
import { AlbumInterface } from '../../../album/interfaces/album.interface';


@Component({
  selector: 'app-ver-uno',
  templateUrl: './ver-uno.component.html',
  styleUrls: ['./ver-uno.component.css']
})
export class VerUnoComponent implements OnInit {

  
  arrayArtistas: any = null;
  arrayAlbum: any = null;


  artista!: ArtistaInterface;
  cancion!: CancionInterface;
  album!: AlbumInterface;


  formCancion: FormGroup = this.fb.group({});

  valoresNoValidos = ['null', null, undefined, ''];
  imagenASubir!: File;
  imagenTemporal: any;

  banderas = {
    agregarFoto :   true,
    cancelarFoto:   false,
    guardarFoto :   false,
    eliminarFoto:   false,
    mostrarFormularioUpdateDataCancion: false,
  };

  
  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;


  constructor(
    private activateRoute: ActivatedRoute,
    public cancionService: CancionService,
    private artistaService: ArtistaService,
    private albumService: AlbumService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    private campoValido: CampoValidoService,
    private validadoresService: ValidadoresService,
    private alertService: AlertasServices,
    public menuService: MenuService,
    private router: Router
  ) {
    this.crearFormularioCancion();
    this.campoValido.miFormulario = this.formCancion;
  }

  ngOnInit(): void {
    this.activeRouteConsulta();

  }

  activeRouteConsulta() {

    this.activateRoute.params.pipe(
      switchMap(({ idCancion }) => this.cancionService.consultarCancionPorId(idCancion)),
      map((resCancionService: any) => {
        this.cancion = this.cancionService.convertirACancionInterface(resCancionService.data);
        return resCancionService.data.album;
      }),

      switchMap((idAlbum) => this.albumService.consultarAlbumPorId(idAlbum)),
      map((resAlbumService: any) => {
        this.album = this.albumService.convertirAAlbumInterface(resAlbumService.data);
        return resAlbumService.data.artista;
      }),

      switchMap((idArtista) => this.artistaService.consultarArtistasPorId(idArtista))
      )
      .subscribe({
        next: (res: any) => {
          this.artista = this.artistaService.convertirAArtistaInterface(res.data);
          this.formatoDate();
          this.resetFormularioCancion();
        }
      });
  }

  /* UPDATE MUSIC INFO */

  esCampoValido(campo: string) : Boolean{ return this.campoValido.esValidoCampo(campo); }


  crearFormularioCancion(){
    this.formCancion = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      numero: [0, [Validators.required, Number]],
      duracion: [0, [Validators.required, Number]],
      genero: ['', [Validators.required]],
      fechaLanzamiento: ['', [Validators.required]],
      artista: ['', [Validators.required]],
      album: ['', [Validators.required]],
      bloqueado: [ '', Validators.required]
    });
  }

  resetFormularioCancion(){
    this.formCancion.reset({
      nombre: this.cancion.nombre,
      numero: this.cancion.numero,
      duracion: this.cancion.duracion,
      genero: this.cancion.genero,
      fechaLanzamiento: this.cancion.fechaLanzamiento,
      artista: this.artista.id,
      album: this.album.id,
      bloqueado: this.cancion.bloqueado
    });
  }


  guardarCambiosCancionModificado(){

    if ( this.formCancion.invalid )  {
      this.formCancion.markAllAsTouched(); 
      return;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.cancionService.actualizarDatosBasicosCancion( this.cancion.id, this.formCancion.value)
        .subscribe({
          next: (res: any) => {
            if(res.ok){
              this.alertService.alertaExito('Se realizaron los cambios de manera exitosa');
              this.mostrarFormularioActualizarData();
              this.activeRouteConsulta();
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

  consultarTodosArtistas(){
    this.artistaService.consultarTodosArtistasSinFiltro()
    .subscribe({
      next: (res: any) => {
        if(res.ok){
          this.asignarDatosArtistasConsultados(res.data);
        }else{
          this.alertService.alertaErrorMs('Error en el servicio');
        }
      },
      error: () => this.alertService.alertaErrorMs('Error en la petición del servicio.')
    });
  }

  consultarAlbumsPorIdArtista(){
    const valorArtista =  this.formCancion.get('artista')?.value;
    this.albumService.consultarAlbumsPorIdArtista(valorArtista)
    .subscribe({
      next: (res: any) => {
        if(res.ok){
          this.asignarDatosAlbumsConsultados(res.data);
        }else{
          this.alertService.alertaErrorMs('Error en el servicio');
        }
      },
      error: () => this.alertService.alertaErrorMs('Error en la petición del servicio.')
    });
  }


  mostrarFormularioActualizarData(){

    (this.banderas.mostrarFormularioUpdateDataCancion) 
      ?(this.banderas.mostrarFormularioUpdateDataCancion = false)
      :(this.campoValido.miFormulario = this.formCancion,
        this.banderas.mostrarFormularioUpdateDataCancion = true,
        this.consultarTodosArtistas());
  }

  asignarDatosArtistasConsultados(data: any){
    this.arrayArtistas = data;
    this.arrayArtistas = this.arrayArtistas.filter((artista: any) => artista._id !== this.artista.id);
  }

  asignarDatosAlbumsConsultados(data: any){
    this.arrayAlbum = data;
    this.formCancion.get('album')?.setValue('');
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
    reader.readAsDataURL(file); // Aqui lo convieete
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
    this.cancionService.guardarImagenCancion(this.imagenASubir, this.cancion.id)
    .subscribe({
      next: () => {
        this.spinnerService.setSpinner = false;
        this.alertService.alertaExito('Imagen Guardado exitosamente');
        this.activeRouteConsulta();
      },
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });

    this.cancelarFotoSeleccionado();
  }

  eliminarFoto(){
    const imagenURL = this.cancion.imagenURL;

    if(this.valoresNoValidos.includes(imagenURL)){
      this.alertService.alertaAdvertercia('¡ Esta cuenta no tiene una Imagen que eliminar !');
      return ;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar la foto', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.cancionService.eliminarImagenCancion(this.cancion.id)
        .subscribe({
          next: () => {
            this.alertService.alertaExito('Se elimino exitosamente');
            this.activeRouteConsulta();
          },
          error: () =>  this.alertService.alertaErrorMs('Error en el servicio')
        });
      }
    });
  }

  verArtista(idArtista: string){
    const role = this.menuService.getRole;
    (role === "ADMINISTRADOR") ? (this.router.navigate(['/administrador/artista/verUno', idArtista])) : (this.router.navigate(['/usuario/artista/verUno', idArtista]));
  }
  verAlbum(idAlbum: string){
    const role = this.menuService.getRole;
    (role === "ADMINISTRADOR") ? (this.router.navigate(['/administrador/album/verUno', idAlbum])) : (this.router.navigate(['/usuario/album/verUno', idAlbum]));
  }

  formatoDate(){
    const newFormat: any = this.cancion.fechaLanzamiento.split('T', 1);
    this.cancion.fechaLanzamiento = newFormat[0];
  }

}