
// Modulos
import { Component, OnInit } from '@angular/core';


// Routes
import {Router} from '@angular/router';

// ModulesForm
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// Services
import { AlertasServices } from '../../../services/alertas.service';
import { AuthAdministradorService } from '../../services/authAdministrador.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  formLogin:FormGroup = this.fb.group({});

  constructor(private router: Router, private fb: FormBuilder, private alertService: AlertasServices,
    private authAdmin: AuthAdministradorService, private campoValido: CampoValidoService, public spinnerService: SpinnerService) {

      this.crearFormulario();
      this.campoValido.miFormulario = this.formLogin; // ASIGNAR el nuestro formulario al formulario que tenemos en el servicio
  }

  ngOnInit(): void {
  }

  regresarPaginaInicio(){
    this.router.navigateByUrl("/");
  }

  forgotPassword(){
    this.router.navigateByUrl('/authAdministrador/forgotPassword');
  }

  esCampoValido(campo: string) : Boolean{ return this.campoValido.esValidoCampo(campo) }

  crearFormulario(){
      this.formLogin = this.fb.group({
      email:     ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  enviarDatos() {

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    this.spinnerService.setSpinner = true; // Active spinner

    this.authAdmin.login(this.formLogin.value).subscribe(
      (resp: any) => {
        this.spinnerService.setSpinner = false// Deactivate spinner
        if (resp.ok) {
          this.alertService.alertaExito('Loguiado Exitosamente');
          this.router.navigateByUrl('administrador');
        } else {
          const message: string = resp.message.error.mensaje;
          this.alertService.alertaErrorMs(message);
        }
      },
      (error) => {
        this.alertService.alertaErrorMs('Error en la petición del servicio.');
      });

  }

}
