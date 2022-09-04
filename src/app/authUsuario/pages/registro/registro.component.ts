// Modulos
import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';


// Servicios
import { AuthUsuarioService } from '../../services/authUsuario.service';
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { AlertasServices } from '../../../services/alertas.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { SpinnerService } from '../../../services/spinner.service';
import { ValidadoresService } from '../../../services/validadores.service';



declare const gapi: any;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formResgistroUsuario!: FormGroup;
  public auth2: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authUsuarioService: AuthUsuarioService,
    private alertService: AlertasServices,
    private campoValidoService: CampoValidoService,
    private spinnersService: SpinnerService,
    private validadoresService: ValidadoresService,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.crearFormulario();
    this.campoValidoService.miFormulario = this.formResgistroUsuario;
  }

  ngOnInit(): void {
    this.renderButton();
  }

  esCampoValido(campo: string): Boolean { return this.campoValidoService.esValidoCampo(campo) }

  crearFormulario() {
    this.formResgistroUsuario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      // eslint-disable-next-line no-useless-escape
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validators: this.validadoresService.passwordsIguales('password', 'confirmarPassword')
    })
  }

  resetearFormulario() {
    this.formResgistroUsuario.reset(
      {
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        confirmarPassword: ''
      }
    )
  }

  crearUsuarioNuevo() {

    if (this.formResgistroUsuario.invalid) {
      this.formResgistroUsuario.markAllAsTouched();
      return;
    }

    const data: any = { ...this.formResgistroUsuario.value };
    delete data.confirmPassword;

    this.spinnersService.setSpinner = true;
    this.usuarioService.crearUsuarioNuevo(data).subscribe({
      next: (res: any) => {
        if (res.ok) {
          const message = res.mensaje;
          this.alertService.alertaExito(message);
          this.resetearFormulario();
        } else {
          const message = res.message.error.mensaje;
          this.alertService.alertaErrorMs(message);
        }
        this.spinnersService.setSpinner = false;
      },
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    })
  }

  /* registro con GOOGLE  */


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
  }


  attachSignin(element: any) {

    this.auth2.attachClickHandler(element, {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token;

        this.authUsuarioService.loginConGoogle(id_token)
        .subscribe({
          next: () => {
            this.ngZone.run( () => {
              this.alertService.alertaExito(' Bienvenido ');
              this.router.navigateByUrl('/usuario');
            });
          }
        })

      }, function (error: any) {
        alert(JSON.stringify(error, undefined, 2));
      });

  }

}
