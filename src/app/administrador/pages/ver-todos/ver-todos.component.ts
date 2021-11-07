
import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';

// services
import { AdministradorService } from '../../services/administrador.service';
import { AlertasServices } from '../../../services/alertas.service';
import { CampoValidoService } from '../../../services/campoValido.service';

// forms
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// rxjs
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// interface
import { AdministradorInterface } from '../../interfaces/administrador.interface';


@Component({
  selector: 'app-ver-todos',
  templateUrl: './ver-todos.component.html',
  styleUrls: ['./ver-todos.component.css']
})
export class VerTodosComponent implements OnInit {


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

  arrayAdministradores!: any[];
  administradorAModificar!: AdministradorInterface;

  formModificarAdministrador: FormGroup = this.fb.group({});
  @ViewChild('termino') termino!: ElementRef;


  constructor(
    private administradorService: AdministradorService,
    private alertService: AlertasServices,
    private fb: FormBuilder,
    private campoValidoService: CampoValidoService
    ) {
    this.consultarTodosAdministradores(1);
  }

  ngOnInit(): void {
    
    this.crearFormularioModificarAdministrador();
    this.campoValidoService.miFormulario = this.formModificarAdministrador;
    this.debouncer
    .pipe(debounceTime(500)) // Para emitir despues de 300 milisegundos.
    .subscribe( (numeroPagina) => {
      const termino = this.termino.nativeElement.value
      this.administradorService.consultarAdministradoresPorTermino(termino, numeroPagina) // TODO ESTO PUEDE SER REDUCIDO
      .subscribe(
        (res) => {
          if(res == null){
            this.alertService.alertaAdvertercia('No se encontraron administradores');
          }else{
            this.asignarValoreDeRespuestaServicio(res);
            this.banderas.busquedaTermino = true;
          }
        },
        (error) => {
          this.alertService.alertaErrorMs('Error en la petición del servicio');
        }
      )
    });
  }

  esCampoValido(campo: string) : Boolean{ return this.campoValidoService.esValidoCampo(campo) }

  crearFormularioModificarAdministrador(){
    this.formModificarAdministrador = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      bloqueado: ['', [Validators.required]],
      confirmarCorreo: ['', [Validators.required]]
    })
  }

  resetFormularioModificarAdministrador(){
    this.formModificarAdministrador.reset({
      nombre: this.administradorAModificar.nombre,
      apellidos: this.administradorAModificar.apellidos,
      email: this.administradorAModificar.email,
      bloqueado: this.administradorAModificar.bloqueado, 
      confirmarCorreo: this.administradorAModificar.confirmarCorreo,
    });
  }


  consultarTodosAdministradores(numeroPagina: number){
    this.administradorService.consultarTodosAdministradores(numeroPagina)
    .subscribe(
      (res) => {
        this.asignarValoreDeRespuestaServicio(res);
      },
      (error) => {
        this.alertService.alertaErrorMs('Error en el servicio');
      }
    );
  }


  consultarAdministradorPorTermino(numeroPagina = 1){
    const termino = this.termino.nativeElement.value;
    if(!!termino || termino !== ""){
      this.debouncer.next(numeroPagina);
    }
  }
  
  cambiarPagina(numeroPagina: number){
      if(this.banderas.busquedaTermino){
        this.consultarAdministradorPorTermino(numeroPagina);
      }else{
        this.consultarTodosAdministradores(numeroPagina);
      }
  }

  limpiarInputSearch(){
    this.banderas.busquedaTermino = false;
    this.termino.nativeElement.value = '';
    this.consultarTodosAdministradores(1);
  }

  eliminarAdministrador(idAdministrador: string){
    this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar al Administrador', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.administradorService.eliminarAdministrador(idAdministrador)
        .subscribe(
          (res) => {
            this.alertService.alertaExito("Administrador Eliminado Exitosamente");
            this.consultarTodosAdministradores(1);
          },
          (error) => {
            this.alertService.alertaErrorMs('Error en el servicio');
          }
        );
      }
    });
  }

  mostrarFormulario(){

    (this.banderas.mostrarFormulario) ? (this.banderas.mostrarFormulario = false) :(this.banderas.mostrarFormulario = true);

  }

  guardarModificacionAdministradorSeleccionado(){

    if ( this.formModificarAdministrador.invalid )  {
      this.formModificarAdministrador.markAllAsTouched(); 
      return;
    }
    
    const idAdministradorAModificar = this.administradorAModificar.id,
    data = this.formModificarAdministrador.value;
          
    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.administradorService.modificarDatosAdministrador(idAdministradorAModificar, data)
        .subscribe(
          (res: any) => {
            if(res.ok){
              this.alertService.alertaExito('Administrador Actualizado Exitosamente');
              this.mostrarFormulario();
              this.consultarTodosAdministradores(1);
            }else{
              const message: string = res.message.error.mensaje;
              this.alertService.alertaErrorMs(message);
            }
          },
          (error) => {
            console.log('Error en la petición del servicio');
            this.alertService.alertaErrorMs('Error en el servicio');
          }
        );
      }
    });

  }

  asignarDatosAdministradorAModificar(indexAdministrador: number){
    const {_id, ...value} = this.arrayAdministradores[indexAdministrador];
    this.administradorAModificar = {...value};
    this.administradorAModificar.id = _id;
    
    this.resetFormularioModificarAdministrador();
    this.mostrarFormulario();
  }

  asignarValoreDeRespuestaServicio(data: any){

    this.arrayAdministradores = data.docs;
    this.controlPaginacion.siguientePagina = data.nextPage;
    this.controlPaginacion.anteriorPagina = data.prevPage;
    this.controlPaginacion.hasNextPage = data.hasNextPage;
    this.controlPaginacion.hasPrevPage = data.hasPrevPage;
  }

}
