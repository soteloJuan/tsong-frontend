import { Component, OnInit } from '@angular/core';

// Servicios
import { AdministradorService } from '../../services/administrador.service';
import { ValidadoresService } from '../../services/validadores.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';


// Forms
import {FormGroup, FormBuilder, Validators} from '@angular/forms';



@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {


  formRegistro!: FormGroup;

  constructor(private fb: FormBuilder, private administradorService: AdministradorService,
    private validadoresService: ValidadoresService, private campoValido: CampoValidoService, private alertService: AlertasServices) { }

  ngOnInit(): void {
    this.crearFormRegistro();
    this.campoValido.miFormulario = this.formRegistro;
  }


  esCampoValido(campo: string) :Boolean{ return this.campoValido.esValidoCampo(campo) }



  crearFormRegistro(){
    this.formRegistro = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: this.validadoresService.passwordsIguales('password','confirmPassword')
    });
  }

  resetearFormRegistro(){
    this.formRegistro.reset({
      nombre: '',
      apellidos: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }

  guardarNuevoAdministrador(){

    if ( this.formRegistro.invalid )  {
      this.formRegistro.markAllAsTouched(); 
      return;
    }

    const data:any = {...this.formRegistro.value};
    delete data.confirmPassword;


    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.administradorService.crearAdministrador(data)
        .subscribe(
          (res: any) => {
            if(res.ok){
            this.alertService.alertaExito('Administrador Creado Exitosamente');
            this.resetearFormRegistro();
            }else{
              const message = res.message.error.mensaje;
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

}

