import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Servicios
import {ArtistaService} from '../../../artista/services/artista.service';
import { AlbumService } from '../../services/album.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';
import { SpinnerService } from '../../../services/spinner.service';

// Forms
import {FormGroup, FormBuilder, Validators} from '@angular/forms';


// interfaces
import { AlbumInterface } from '../../interfaces/album.interface';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  formRegistroAlbum!: FormGroup;
  albumAModificar: AlbumInterface = {
    id: '',
    bloqueado: false,
    descripcion: '',
    fechaLanzamiento: '',
    imagenID: '',
    imagenURL: '',
    nombre: '',
    artista: ''
  }

  imagenASubir!: File;
  imagenTemporal: any;
  arrayArtistas: any = null;

  banderas = {
    agregarFoto :   true,
    cancelarFoto:   false,
    guardarFoto :   false,
    mostrarCardUpdatePhoto: false
  };

  
  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;

  constructor(private fb: FormBuilder, private albumService: AlbumService,
    private campoValido: CampoValidoService, private alertService: AlertasServices, private spinnerService: SpinnerService,
    private artistaService: ArtistaService) { 
      this.consultarTodosArtistas();
    }


  ngOnInit(): void {
    this.crearFormRegistroAlbum();
    this.campoValido.miFormulario = this.formRegistroAlbum;

  }

  esCampoValido(campo: string) :Boolean{ return this.campoValido.esValidoCampo(campo) }
  
    
  crearFormRegistroAlbum(){
    this.formRegistroAlbum = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      artista: ['', [Validators.required]],
      fechaLanzamiento: ['', [Validators.required]],
      descripcion: ['', [Validators.required,  Validators.minLength(6)]]
    }
    );
  }

  resetearFormRegistroAlbum(){
    this.formRegistroAlbum.reset({
      nombre: '',
      artista: '',
      fechaLanzamiento: '',
      descripcion: ''
    });
  }


  guardarNuevoAlbum(){
  
    if ( this.formRegistroAlbum.invalid )  {
      this.formRegistroAlbum.markAllAsTouched(); 
      return;
    }

    const data:any = {...this.formRegistroAlbum.value};
  
    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.albumService.crearAlbum(data)
        .subscribe({
          next: (res: any) => {
            if(res.ok){
              this.alertService.alertaExito('Album Creado Exitosamente');
              this.resetearFormRegistroAlbum();
              this.asignarDatosAlbum(res.data);
  
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
  
  cerrarCardUpdatePhoto(){ this.banderas.mostrarCardUpdatePhoto = false; }

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
    this.albumService.guardarImagenAlbum(this.imagenASubir, this.albumAModificar.id)
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

  consultarTodosArtistas(){
    this.artistaService.consultarTodosArtistasSinFiltro()
    .subscribe({
      next: (res: any) => {
        if(res.ok){
          this.asignarDatosArtistas(res.data);
        }else{
          this.alertService.alertaErrorMs('Error en el servicio');
        }
      }
    })
  }

  asignarDatosAlbum(data: any){
    const {_id, ...value} = data;
    this.albumAModificar = {...value}
    this.albumAModificar.id = _id;
    this.banderas.mostrarCardUpdatePhoto = true;
  }

  asignarDatosArtistas(data: any){
    this.arrayArtistas = data;
  }

}
