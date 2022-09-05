import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// servicios
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { AlertasServices } from '../../../services/alertas.service';
import {CampoValidoService} from '../../../services/campoValido.service';

// forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; 

// rcjs
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Router
import {Router} from '@angular/router';

// interfaces
import { UsuarioInterface } from '../../../usuario/interfaces/usuarios.interfaces';


@Component({
  selector: 'app-ver-todos-usuarios',
  templateUrl: './ver-todos-usuarios.component.html',
  styleUrls: ['./ver-todos-usuarios.component.css']
})
export class VerTodosUsuariosComponent implements OnInit {

  debouncer: Subject<number> = new Subject(); 

  controlPaginacion:any = {
    siguientePagina: 1,
    anteriorPagina : 1,
    hasNextPage: false,
    hasPrevPage: false
  };

  banderas = {
    busquedaTermino: false,
    mostrarFormulario: false
  };

  arrayUsuarios!: any[];
  UsuarioAModificar!: UsuarioInterface;

  formModificarUsuario: FormGroup = this.fb.group({});
  @ViewChild('termino') termino!: ElementRef;

  constructor(
    private usuarioService: UsuarioService,
    private alertService: AlertasServices,
    private fb: FormBuilder,
    private campoValidoService: CampoValidoService,
    private router: Router
    ) { 
      this.consultarTodosUsuarios(1);
    }

    ngOnInit(): void {
    
      this.crearFormularioModificarAdministrador();

      this.campoValidoService.miFormulario = this.formModificarUsuario;
      this.debouncer
      .pipe(debounceTime(500)) // Para emitir despues de 300 milisegundos.
      .subscribe( (numeroPagina) => {
        const termino = this.termino.nativeElement.value;
        this.usuarioService.consultarUsuarioPorTermino(termino, numeroPagina)
        .subscribe({
          next: (res) => {
            if(res == null){
              this.alertService.alertaAdvertercia('No se encontraron administradores');
            }else{
              this.asignarValoreDeRespuestaServicio(res);
              this.banderas.busquedaTermino = true;
            }
          },
          error: () => this.alertService.alertaErrorMs('Error en la petición del servicio')
        });
      });
    }
  
    esCampoValido(campo: string) : Boolean{ return this.campoValidoService.esValidoCampo(campo); }
  
    crearFormularioModificarAdministrador(){
      this.formModificarUsuario = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        apellidos: ['', [Validators.required, Validators.minLength(3)]],
        // eslint-disable-next-line no-useless-escape
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        bloqueado: ['', [Validators.required]],
        confirmarCorreo: ['', [Validators.required]]
      });
    }
  
    resetFormularioModificarAdministrador(){
      this.formModificarUsuario.reset({
        nombre: this.UsuarioAModificar.nombre,
        apellidos: this.UsuarioAModificar.apellidos,
        email: this.UsuarioAModificar.email,
        bloqueado: this.UsuarioAModificar.bloqueado, 
        confirmarCorreo: this.UsuarioAModificar.confirmarCorreo,
      });
    }
  
    consultarTodosUsuarios(numeroPagina: number){
      this.usuarioService.consultarTodosUsuarios(numeroPagina)
      .subscribe({
        next: (res) => this.asignarValoreDeRespuestaServicio(res),
        error: () => this.alertService.alertaErrorMs('Error en el servicio')
      });      
    }
  
    consultarUsuarioPorTermino(numeroPagina = 1){
      const termino = this.termino.nativeElement.value;
      if(!!termino || termino !== ""){
        this.debouncer.next(numeroPagina);
      }
    }

    cambiarPagina(numeroPagina: number){
      (this.banderas.busquedaTermino) ? (this.consultarUsuarioPorTermino(numeroPagina)) : (this.consultarTodosUsuarios(numeroPagina));
    }
  
    limpiarInputSearch(){
      this.banderas.busquedaTermino = false;
      this.termino.nativeElement.value = '';
      this.consultarTodosUsuarios(1);
    }
  
    eliminarUsuario(idUsuario: string){
      this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar al Usuario', 'si')
      .then( (result) => {
        if(result.isConfirmed){
          this.usuarioService.eliminarUsuario(idUsuario)
          .subscribe({
            next: () => {
              this.alertService.alertaExito("Usuario Eliminado Exitosamente");
              this.consultarTodosUsuarios(1);
            },
            error: () => this.alertService.alertaErrorMs('Error en el servicio')
          });
        }
      });
    }

    mostrarFormulario(){  
      (this.banderas.mostrarFormulario) ? (this.banderas.mostrarFormulario = false) :(this.banderas.mostrarFormulario = true);
    }
  
    guardarModificacionAdministradorSeleccionado(){
  
      if ( this.formModificarUsuario.invalid )  {
        this.formModificarUsuario.markAllAsTouched(); 
        return;
      }
      
      const idAdministradorAModificar = this.UsuarioAModificar.id,
      data = this.formModificarUsuario.value;
            
      this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
      .then( (result) => {
        if(result.isConfirmed){
          this.usuarioService.modificarDatosUsuario(idAdministradorAModificar, data)
          .subscribe({
            next: (res: any) => {
              if(res.ok){
                this.alertService.alertaExito('Administrador Actualizado Exitosamente');
                this.mostrarFormulario();
                this.consultarTodosUsuarios(1);
              }else{
                const message: string = res.message.error.mensaje;
                this.alertService.alertaErrorMs(message);
              }                  
            },
            error: () => this.alertService.alertaErrorMs('Error en el servicio')
          });
        }
      });  
    }

    verUnUsuario(idUsuario: string){
      this.router.navigate(['/administrador/verUnUsuario', idUsuario]);
    }
  
    asignarDatosAdministradorAModificar(indexUsuario: number){
      const {_id, ...value} = this.arrayUsuarios[indexUsuario];
      this.UsuarioAModificar = {...value};
      this.UsuarioAModificar.id = _id;
      
      this.resetFormularioModificarAdministrador();
      this.mostrarFormulario();
    }
  
    asignarValoreDeRespuestaServicio(data: any){
      this.arrayUsuarios = data.docs;
      this.controlPaginacion.siguientePagina = data.nextPage;
      this.controlPaginacion.anteriorPagina = data.prevPage;
      this.controlPaginacion.hasNextPage = data.hasNextPage;
      this.controlPaginacion.hasPrevPage = data.hasPrevPage;

    }
  
}
