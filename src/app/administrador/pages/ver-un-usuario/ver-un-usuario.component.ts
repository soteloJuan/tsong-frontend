import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';


// Servicios
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { ListaService } from '../../../lista/services/lista.service';
import { MenuService } from '../../../services/menu.service';
import {ValidadoresService} from '../../../services/validadores.service';
import {SpinnerService} from '../../../services/spinner.service';
import {CampoValidoService} from '../../../services/campoValido.service';
import { AlertasServices } from '../../../services/alertas.service';


// interfaces
import { UsuarioInterface } from '../../../usuario/interfaces/usuarios.interfaces';


// Router
import {Router, ActivatedRoute} from '@angular/router';


//rxjs
import { switchMap, tap, map } from 'rxjs/operators';


// Formularios
import {FormGroup, Validators, FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-ver-un-usuario',
  templateUrl: './ver-un-usuario.component.html',
  styleUrls: ['./ver-un-usuario.component.css']
})
export class VerUnUsuarioComponent implements OnInit {

  usuario!: UsuarioInterface;
  arrayListas: any;
  formUsuario: FormGroup = this.fb.group({});


  valoresNoValidos = ['null', null, undefined, ''];
  imagenASubir!: File;
  imagenTemporal: any;

  banderas = {
    agregarFoto :   true,
    cancelarFoto:   false,
    guardarFoto :   false,
    eliminarFoto:   false,
    mostrarFormularioUpdateDataUsuario: false,
  };

  controlPaginacion:any = {
    siguientePagina: 0,
    anteriorPagina : 0,
    hasNextPage: false,
    hasPrevPage: false
  };

  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;


  constructor(
    private activatedRoute: ActivatedRoute,
    public usuarioService: UsuarioService,
    private listaService: ListaService,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    private campoValido: CampoValidoService,
    private validadoresService: ValidadoresService,
    private alertService: AlertasServices,
    public menuService: MenuService,
    private router: Router
  ) { 
  }

  ngOnInit(): void {
    this.activateRouteConsulta();
  }



  activateRouteConsulta(){

    this.activatedRoute.params.pipe(
      switchMap( ({idUsuario}) => this.usuarioService.consultarUsuarioPorId(idUsuario)),
      tap( (resUsuarioService) => {
        this.usuario = this.usuarioService.formatoParaUsuario(resUsuarioService.data);
      }),
    ).subscribe(
      (res: any) => {
        this.consultarTodosListasPorUsuario(1);
        this.crearFormularioUsuario();
      }
    );
  }

  consultarTodosListasPorUsuario(numeroPagina: number) {
    this.listaService.consultarTodosListaPorUsuarios(this.usuario.id, numeroPagina)
      .subscribe(
        (res: any) => {
          (res) && this.asignarValoreDeRespuestaServicio(res);
        },
        (error) => {
          this.alertService.alertaErrorMs('Error en el servicio');
        }
      );
  }



  asignarValoreDeRespuestaServicio(data: any) {

    this.arrayListas = data.docs;
    this.controlPaginacion.siguientePagina = data.nextPage;
    this.controlPaginacion.anteriorPagina = data.prevPage;
    this.controlPaginacion.hasNextPage = data.hasNextPage;
    this.controlPaginacion.hasPrevPage = data.hasPrevPage;

    console.log('Array Listas : ', this.arrayListas);

  }





  mostrarFormularioActualizarData(){
    if(this.banderas.mostrarFormularioUpdateDataUsuario){
      this.banderas.mostrarFormularioUpdateDataUsuario = false;
    }else{
      this.campoValido.miFormulario = this.formUsuario;
      this.banderas.mostrarFormularioUpdateDataUsuario = true;
      this.resetFormularioUsuario();
    }
  }

  
  esCampoValido(campo: string) : Boolean{ return this.campoValido.esValidoCampo(campo) }


  crearFormularioUsuario(){
    this.formUsuario = this.fb.group({
      nombre: [this.usuario.nombre , [Validators.required, Validators.minLength(2)]],
      apellidos: [this.usuario.apellidos , [Validators.required, Validators.minLength(2)]],
      email: [this.usuario.email , [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      bloqueado: [this.usuario.bloqueado , [Validators.required]],
    });
  }

  resetFormularioUsuario(){
    this.formUsuario.reset({
      nombre: this.usuario.nombre,
      apellidos: this.usuario.apellidos,
      email: this.usuario.email,
      bloqueado: this.usuario.bloqueado,
    });
  }




  guardarCambiosUsuario(){

    if ( this.formUsuario.invalid )  {
      this.formUsuario.markAllAsTouched(); 
      return;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
    .then( (result) => {
      if(result.isConfirmed){
        this.usuarioService.actualizarUsuario(this.formUsuario.value, this.usuario.id)
        .subscribe( 
          (res) => {
            if(res.ok){
              this.alertService.alertaExito('Se realizaron los cambios de manera exitosa');
              this.mostrarFormularioActualizarData();
              this.activateRouteConsulta();
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


  reproducirListaReproduccion(idListaReproduccion: string){
    console.log('Lista Reproduccion a Reproducir: ', idListaReproduccion);
  }

  verMasListaReproduccion(idListaReproduccion: string){ // PENDIENTE --->
  this.router.navigate(['/administrador/lista/verUno', idListaReproduccion]);
  }

  eliminarListaReproduccion(idListaReproduccion: string){
      this.alertService.alertaPreguta('Estas seguro', 'Se eliminara la Lista', 'si')
      .then( (result) => {
        if(result.isConfirmed){
          this.listaService.eliminarListaReproduccionPropio(idListaReproduccion)
          .subscribe(
            (res) => {
              this.alertService.alertaExito("Lista Eliminado Exitosamente");
              this.consultarTodosListasPorUsuario(1);
            },
            (error) => {
              this.alertService.alertaErrorMs('Error en el servicio');
            }
          );
        }
      });

  }





}







