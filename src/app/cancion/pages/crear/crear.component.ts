import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Servicios
import {ArtistaService} from '../../../artista/services/artista.service';
import {AlbumService} from '../../../album/services/album.service';
import { CancionService } from '../../services/cancion.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';
import { SpinnerService } from '../../../services/spinner.service';

// Forms
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

// interfaces
import { CancionInterface } from '../../interfaces/cancion.interface';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  formRegistroCancion!: FormGroup;
  cancionAModificar: CancionInterface = {
    id: "",
    bloqueado: false,
    fechaLanzamiento: "",
    imagenID: "",
    imagenURL: "",
    nombre: "",
    numero: 0,
    duracion: 0,
    cancionID: "",
    cancionURL: "",
    genero: "",
    artista: "",
    album: "",
  }

  archivoMusicaASubir!: File;
  archivoMusicalTemporal!: any;

  imagenASubir!: File;
  imagenTemporal: any;

  arrayArtistas: any = null;
  arrayAlbum: any = null;


  banderasPhoto = {
    agregarFoto :   true,
    cancelarFoto:   false,
    guardarFoto :   false,
    mostrarCardUpdatePhoto: false
  };

  banderasMusica = {
    agregarMusica: true,
    cancelarMusica: false,
    guardarMusica: false,
      mostrarCardUpdateArchivoMusica: false
  }

  
  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;
  @ViewChild('changeAUDIO') inputChangeArchivoAudio !: ElementRef;
  @ViewChild('audio') audio !: ElementRef;


  constructor(
    private fb: FormBuilder,
    public cancionService: CancionService,
    private campoValido: CampoValidoService,
    private alertService: AlertasServices,
    private spinnerService: SpinnerService,
    private artistaService: ArtistaService,
    private albumService: AlbumService
    ) { 
      this.consultarTodosArtistas();
    }

    ngOnInit(): void {
      this.crearFormRegistroCancion();
      this.campoValido.miFormulario = this.formRegistroCancion;
  
    }

    // Formulario
    esCampoValido(campo: string) :Boolean{ return this.campoValido.esValidoCampo(campo) }

    crearFormRegistroCancion(){
      this.formRegistroCancion = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        numero: [0, [Validators.required, Number]],
        duracion: [0, [Validators.required, Number]],
        genero: ['', [Validators.required]],
        fechaLanzamiento: ['', [Validators.required]],
        artista: ['', [Validators.required]],
        album: ['', [Validators.required]],
      }
      );
    }

    resetearFormRegistroCancion(){
      this.formRegistroCancion.reset({
        nombre: '',
        numero: 0,
        duracion: 0,
        genero: '',
        fechaLanzamiento: '',
        artista: '',
        album: ''
      });
    }

    guardarNuevaCancion(){
  
      if ( this.formRegistroCancion.invalid )  {
        this.formRegistroCancion.markAllAsTouched(); 
        return;
      }

      const data:any = {...this.formRegistroCancion.value};

      this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
      .then( (result) => {
        if(result.isConfirmed){
          this.cancionService.crearCancion(data)
          .subscribe({
            next: (res: any) => {
              if(res.ok){
                this.alertService.alertaExito('Canción Creado Exitosamente');
                this.resetearFormRegistroCancion();
                this.asignarDatosCancionAModificar(res.data);  
              }else{
                const message = res.message.error.mensaje;
                this.alertService.alertaErrorMs(message);
              }  
            },
            error: () => this.alertService.alertaErrorMs('Error en la petición del servicio.')
          });
        }
      });
    }

    // Guardar Foto
    cerrarCardUpdatePhoto(){ this.banderasPhoto.mostrarCardUpdatePhoto = false; }

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
      this.banderasPhoto.cancelarFoto = true;
      this.banderasPhoto.guardarFoto = true;
      this.banderasPhoto.agregarFoto = false;
    }
  
    cancelarFotoSeleccionado(){
      this.imagenTemporal        = null;
      this.banderasPhoto.cancelarFoto = false;
      this.banderasPhoto.guardarFoto  = false;
      this.banderasPhoto.agregarFoto  = true;
    }

    guardarFoto(){ 

      if(!this.imagenASubir) return ;

      this.spinnerService.setSpinner = true;
      this.cancionService.guardarImagenCancion(this.imagenASubir, this.cancionAModificar.id)
      .subscribe({
        next: () => {
          this.spinnerService.setSpinner = false;
          this.alertService.alertaExito('Imagen Guardado exitosamente');
          this.cerrarCardUpdatePhoto();  
        },
        error: () => this.alertService.alertaErrorMs('Error en el servicio')
      });
      this.cancelarFotoSeleccionado();
    }

    // Guardar Archivo de Musica

    cerrrarCardUpdateArchivoMusica(){ this.banderasMusica.mostrarCardUpdateArchivoMusica = false; }
    
    seleccionarArchivoAudio(){

      this.archivoMusicaASubir = this.inputChangeArchivoAudio.nativeElement.files[0];
      const file = this.inputChangeArchivoAudio.nativeElement.files[0];
      const arrayValorerFileName = file.type.split('/');
      const extension  = arrayValorerFileName[1];
      const extensionesValidas = ['mp3', 'mp4', 'mpeg', 'mpg', 'jpg', 'midi', 'wav', 'wav', 'mp2', 'wm', 'ogg'];

      if(!file) return ;

      if(!extensionesValidas.includes(extension)){
        this.alertService.alertaErrorMs('Archivo de audio no permitido');
        return ;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => { 
        this.archivoMusicalTemporal = reader.result;
        this.audio.nativeElement.src = reader.result;
      };

      this.banderasMusica.cancelarMusica = true;
      this.banderasMusica.guardarMusica = true;
      this.banderasMusica.agregarMusica = false;
  
    }

    cancelarArchivoMusicaSeleccionado(){
      this.audio.nativeElement.src = ""
      this.archivoMusicalTemporal        = null;
      this.banderasMusica.cancelarMusica = false;
      this.banderasMusica.guardarMusica  = false;
      this.banderasMusica.agregarMusica  = true;
    }

    guardarArchivoMusica(){ 

      if(!this.archivoMusicaASubir) return ;
            
      this.spinnerService.setSpinner = true;
      this.cancionService.actualizarArchivoDeMusica(this.archivoMusicaASubir, this.cancionAModificar.id).subscribe({
        next: () => {
          this.spinnerService.setSpinner = false;
          this.alertService.alertaExito('Archivo de Musica Guardado exitosamente');
          this.cerrrarCardUpdateArchivoMusica();
          this.banderasPhoto.mostrarCardUpdatePhoto = true;
        },
        error: () => this.alertService.alertaErrorMs('Error en el servicio')
      });
  
      this.cancelarArchivoMusicaSeleccionado();
    }

    // Cosultas
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
      })
    }
    
    consultarAlbumsPorIdArtista(){
      const valorArtista =  this.formRegistroCancion.get('artista')?.value;
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

    asignarDatosCancionAModificar(data: any){
      const {_id, ...value} = data;
      this.cancionAModificar = {...value}
      this.cancionAModificar.id = _id;
      this.banderasMusica.mostrarCardUpdateArchivoMusica = true;  
    }

    asignarDatosArtistasConsultados(data: any){
      this.arrayArtistas = data;
    }

    asignarDatosAlbumsConsultados(data: any){
      this.arrayAlbum = data;
    }
  
}
