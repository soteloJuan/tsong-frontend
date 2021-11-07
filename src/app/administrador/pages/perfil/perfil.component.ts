import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';


// Formularios
import {FormGroup, Validators, FormBuilder} from '@angular/forms';

// Services
import { AdministradorService } from '../../services/administrador.service';
import { AlertasServices } from '../../../services/alertas.service';
import { SpinnerService } from '../../../services/spinner.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { ValidadoresService } from '../../../services/validadores.service';

// Interfaces
import { AdministradorInterface } from '../../interfaces/administrador.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  formProfile: FormGroup = this.fb.group({});
  formPassword: FormGroup = this.fb.group({});

  valoresNoValidos = ['null', null, undefined, ''];
  imagenASubir!: File;
  imagenTemporal: any;

  banderas = {
    agregarFoto :   true,
    cancelarFoto:   false,
    guardarFoto :   false,
    eliminarFoto:   false,
    mostrarFormularioUpdateData: false,
    mostrarFormularioUpdatePassword: false
  };



  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;

  administrador!: AdministradorInterface;
  
  constructor(
    public administradorService: AdministradorService,
    private render2: Renderer2,
    private alertService: AlertasServices,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    private campoValido: CampoValidoService,
    private validadoresService: ValidadoresService
    ) {
    }

    ngOnInit(): void {
      const SetTimeoutFormProfile = setTimeout(() => {
        this.administrador = this.administradorService.getAdministrador;
        this.crearFormularioProfile();
      }, 500);
      SetTimeoutFormProfile;
      this.crearFormularioPassword();
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
    this.administradorService.guardarImagen(this.imagenASubir, this.administrador.id).subscribe(
      (resp) => {
        this.spinnerService.setSpinner = false;
        this.alertService.alertaExito('Imagen Guardado exitosamente');
      },
      (error) => {
        this.alertService.alertaErrorMs('Error en el servicio');
      }
    );

    this.cancelarFotoSeleccionado();
  }

  eliminarFoto(){
    const imagenURL = this.administradorService.getAdministrador.imagenURL;

    if(this.valoresNoValidos.includes(imagenURL)){
      this.alertService.alertaAdvertercia('¡ Esta cuenta no tiene una Imagen que eliminar !');
      return ;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar la foto', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.administradorService.eliminarImagen().subscribe(
          (resp) => {
            this.alertService.alertaExito('Se elimino exitosamente');
          },
          (error) => this.alertService.alertaErrorMs('Error en el servicio')
        );
      }
    });
    
  }



  /* UPDATE PROFILE */

  esCampoValido(campo: string) : Boolean{ return this.campoValido.esValidoCampo(campo) }

  crearFormularioProfile(){
    this.formProfile = this.fb.group({
      nombre: [this.administrador.nombre , [Validators.required, Validators.minLength(2)]],
      apellidos: [this.administrador.apellidos , [Validators.required, Validators.minLength(2)]],
      email: [this.administrador.email , [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      bloqueado: [this.administrador.bloqueado , [Validators.required]],
    });
  }
  resetFormularioProfile(){
    this.formProfile.reset({
      nombre: this.administrador.nombre,
      apellidos: this.administrador.apellidos,
      email: this.administrador.email,
      bloqueado: this.administrador.bloqueado,
    });
  }

  guardarCambiosProfile(){

    if ( this.formProfile.invalid )  {
      this.formProfile.markAllAsTouched(); 
      return;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.administradorService.actualizarAdministrador(this.formProfile.value, this.administrador.id)
        .subscribe( 
          (res) => {
            if(res.ok){
              this.alertService.alertaExito('Se realizaron los cambios de manera exitosa');
              this.mostrarFormularioActualizarData();
            }else{
              const message: string = res.message.error.mensaje;
              this.alertService.alertaErrorMs(message);
            }
          },
          (error) => {
            this.alertService.alertaErrorMs('Error en la petición del servicio.');
          }
        );
      }
    });

  }


  /* CHANGE PASSWORD */

  crearFormularioPassword(){
    this.formPassword = this.fb.group({
      password:['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    },{
      validators: this.validadoresService.passwordsIguales('newPassword','ConfirmNewPassword')
    });
  }

  resetFormularioPassword(){
    this.formPassword.reset({
      password: '',
      newPassword: '',
      ConfirmNewPassword: ''
    });
  }

  guardarCambiosPassword(){

    if ( this.formPassword.invalid )  {
      this.formPassword.markAllAsTouched(); 
      return;
    }
    const value = {
      password: this.formPassword.value.password,
      newPassword: this.formPassword.value.newPassword
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.administradorService.actualizarAdministradorPassword(value, this.administrador.id)
        .subscribe(
          (res: any) => {
            if(res.ok){
              this.alertService.alertaExito('Password Actualizado exitosamente');
              this.mostrarFormularioActualizarPassword();
            }else{
              const message: string = res.message.error.mensaje;
              this.alertService.alertaAdvertercia(message);
            }
          },
          (error) => {
            this.alertService.alertaErrorMs('Error en la petición del servicio.');
          }
        );
    
      }
    });



  }


  /* Funciones banderas para mostrar FORMULARIOS*/

  mostrarFormularioActualizarData(){
    if(this.banderas.mostrarFormularioUpdateData){
      this.banderas.mostrarFormularioUpdateData = false;
      this.resetFormularioProfile();
    }else{
      this.campoValido.miFormulario = this.formProfile; // ASIGNAR nuestro formulario al formulario que tenemos en el servicio
      this.banderas.mostrarFormularioUpdateData = true;
    }
  }

  mostrarFormularioActualizarPassword(){
    if(this.banderas.mostrarFormularioUpdatePassword){
      this.banderas.mostrarFormularioUpdatePassword = false;
      this.resetFormularioPassword();
    }else{
      this.banderas.mostrarFormularioUpdatePassword = true;
      this.campoValido.miFormulario = this.formPassword; // ASIGNAR el nuestro formulario al formulario que tenemos en el servicio
    }
  }



}
