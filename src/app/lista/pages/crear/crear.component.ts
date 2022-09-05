import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Servicios
import { ListaService } from '../../services/lista.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';
import { SpinnerService } from '../../../services/spinner.service';
import { UsuarioService } from '../../../usuario/services/usuario.service';

// Forms
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

// interfaces
import { ListaInterface } from '../../interfaces/lista.interface';
import { UsuarioInterface } from '../../../usuario/interfaces/usuarios.interfaces';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  usuario!: UsuarioInterface;
  formRegistroLista!: FormGroup;
  listaAModificar: ListaInterface = {
    id: '',
    imagenID: '',
    imagenURL: '',
    nombre: '',
    usuario: ''
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
    public listaService: ListaService,
    private campoValido: CampoValidoService,
    private alertService: AlertasServices,
    private spinnerService: SpinnerService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.crearFormRegistroLista();
    this.campoValido.miFormulario = this.formRegistroLista;
  }
  
  esCampoValido(campo: string) :Boolean{ return this.campoValido.esValidoCampo(campo); }
  
  crearFormRegistroLista(){
    this.formRegistroLista = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  resetearFormRegistroLista(){
    this.formRegistroLista.reset({
      nombre: '',
    });
  }

  guardarNuevoLista(){
  
    if ( this.formRegistroLista.invalid )  {
      this.formRegistroLista.markAllAsTouched(); 
      return;
    }

    const data:any = {...this.formRegistroLista.value};
    data.usuario = this.usuarioService.getUsuario.id;
  
    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.listaService.crearLista(data)
        .subscribe({
          next: (res: any) => {
            if(res.ok){
              this.alertService.alertaExito('Lista de Reproducción Creado Exitosamente');
              this.resetearFormRegistroLista();
              this.asignarDatosLista(res.data);
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
    this.listaService.guardarImagenLista(this.imagenASubir, this.listaAModificar.id)
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

  asignarDatosLista(data: any){
    const {_id, ...value} = data;
    this.listaAModificar = {...value};
    this.listaAModificar.id = _id;
    this.banderas.mostrarCardUpdatePhoto = true;

  }

}
