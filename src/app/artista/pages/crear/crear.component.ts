import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Servicios
import { ArtistaService } from '../../services/artista.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';
import { SpinnerService } from '../../../services/spinner.service';

// Forms
import {FormGroup, FormBuilder, Validators} from '@angular/forms';


// interfaces
import { ArtistaInterface } from '../../interfaces/artista.interface';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {


  formRegistroArtista!: FormGroup;
  artistaAModificar: ArtistaInterface = {
    id: '',
    bloqueado: false,
    descripcion: '',
    fechaInicio: '',
    imagenID: '',
    imagenURL: '',
    nombre: '',
    pais: ''
  };

  imagenASubir!: File;
  imagenTemporal: any;

  banderas = {
    agregarFoto :   true,
    cancelarFoto:   false,
    guardarFoto :   false,
    mostrarCardUpdatePhoto: false
  };

  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;

  constructor(
    private fb: FormBuilder,
    public artistaService: ArtistaService,
    private campoValido: CampoValidoService,
    private alertService: AlertasServices,
    private spinnerService: SpinnerService
    ) { }

    ngOnInit(): void {
      this.crearFormRegistroArtista();
      this.campoValido.miFormulario = this.formRegistroArtista;
    }
  
  
    esCampoValido(campo: string) :Boolean{ return this.campoValido.esValidoCampo(campo); }
  
  
    crearFormRegistroArtista(){
      this.formRegistroArtista = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        pais: ['', [Validators.required]],
        fechaInicio: ['', [Validators.required]],
        descripcion: ['', [Validators.required,  Validators.minLength(6)]]
      }
      );
    }
  
    resetearFormRegistroArtisa(){
      this.formRegistroArtista.reset({
        nombre: '',
        pais: '',
        fechaInicio: '',
        descripcion: ''
      });
    }
  
    guardarNuevoArtista(){
  
      if ( this.formRegistroArtista.invalid )  {
        this.formRegistroArtista.markAllAsTouched(); 
        return;
      }
  
      const data:any = {...this.formRegistroArtista.value};
    
      this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
      .then( (result) => {
        if(result.isConfirmed){
          this.artistaService.crearArtista(data)
          .subscribe({
            next: (res: any) => {
              if(res.ok){
                this.alertService.alertaExito('Artista Creado Exitosamente');
                this.resetearFormRegistroArtisa();
                this.asignarDatosArtista(res.data);
          
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
      this.artistaService.guardarImagenArtista(this.imagenASubir, this.artistaAModificar.id)
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

    asignarDatosArtista(data: any){
      const {_id, ...value} = data;
      this.artistaAModificar = {...value};
      this.artistaAModificar.id = _id;
      this.banderas.mostrarCardUpdatePhoto = true;

    }

}
