
import { Component, NgZone, OnInit } from '@angular/core';

// Router
import {Router} from '@angular/router';


// Servicios
import { AuthUsuarioService } from '../../services/authUsuario.service';
import { AlertasServices } from '../../../services/alertas.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { SpinnerService } from '../../../services/spinner.service';


// form
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  formLogin!: FormGroup;
  public auth2: any;


  constructor(
    private fb: FormBuilder,
    private authUsuarioService: AuthUsuarioService,
    private campoValidoService: CampoValidoService,
    private spinnerService: SpinnerService,
    private alertService: AlertasServices,
    private ngZone: NgZone,
    private router: Router
  )
  {
    this.crearFormulario();
    this.campoValidoService.miFormulario = this.formLogin;
  }

  esCampoValido(campo: string): Boolean{return this.campoValidoService.esValidoCampo(campo)};

  ngOnInit(): void {
    this.renderButton();
  }


  crearFormulario(){
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  enviarDatosLogin(){

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    const data: any = this.formLogin.value;
    this.spinnerService.setSpinner = true; // Active spinner

    this.authUsuarioService.loginConEmailPassword(data)
    .subscribe(
      (res: any) => {
        this.spinnerService.setSpinner = false// Deactivate spinner
        if (res.ok) {
          this.alertService.alertaExito('Loguiado Exitosamente');
          this.router.navigateByUrl('usuario');
        } else {
          const message: string = res.message.error.mensaje;
          this.alertService.alertaErrorMs(message);
        }
      },
      (error) => {
        this.alertService.alertaErrorMs('Error en la petición del servicio.');
      }
    )


  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 30,
      'height': 30,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();
  }

  async startApp() {

    await this.authUsuarioService.googleInit();

    this.auth2 = this.authUsuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin(element: any) {

    this.auth2.attachClickHandler(element, {},
      (googleUser: any) => {
        var id_token = googleUser.getAuthResponse().id_token;

        this.spinnerService.setSpinner = true; // Active spinner
        this.authUsuarioService.loginConGoogle(id_token)
        .subscribe(
          (res) => {
            this.ngZone.run( () => { // Esto es por que la funcion de arriba esta fuera de angular. Y por eso lo ocupamos
              
              this.spinnerService.setSpinner = false// Deactivate spinner
              this.alertService.alertaExito(' Bienvenido ');
              this.router.navigateByUrl('/usuario');

            });

          }
        )

      }, function (error: any) {
        alert(JSON.stringify(error, undefined, 2));
      });

  }



}
