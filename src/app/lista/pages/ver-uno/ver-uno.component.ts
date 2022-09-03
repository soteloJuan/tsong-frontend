import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


// Services
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { ListaService } from '../../services/lista.service';
import { CancionListaReproduccionService } from '../../services/cancionListaReproduccion.service';
import { CancionService } from '../../../cancion/services/cancion.service';
import { AlertasServices } from '../../../services/alertas.service';
import { ValidadoresService } from '../../../services/validadores.service';
import { SpinnerService } from '../../../services/spinner.service';
import { CampoValidoService } from '../../../services/campoValido.service';
import { UsuariosInvitadosService } from '../../services/usuariosInvitados.service';
import {ReproductorService} from '../../../services/reproductor.service';

// Formularios
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

// Router
import {Router, ActivatedRoute} from '@angular/router';

//rxjs
import { switchMap, tap, map } from 'rxjs/operators';

// interfaces 
import { ListaInterface } from '../../interfaces/lista.interface';


@Component({
  selector: 'app-ver-uno',
  templateUrl: './ver-uno.component.html',
  styleUrls: ['./ver-uno.component.css']
})
export class VerUnoComponent implements OnInit {

  ArrayCancionesId: any;
  ArrayUsuariosIds: any;

  listaReproduccion!: ListaInterface;
  cancionesArray!: any[];
  usuariosInvitadoArray!:any[];
  formListaReproduccion: FormGroup = this.fb.group({});
  formInvitados: FormGroup = this.fb.group({});


  valoresNoValidos = ['null', null, undefined, ''];
  imagenASubir!: File;
  imagenTemporal: any;

  banderas = {
    agregarFoto: true,
    cancelarFoto: false,
    guardarFoto: false,
    eliminarFoto: false,
    mostrarFormularioUpdateDataListaReproduccion: false,
    mostrarFormularioAgregarInvitado: false
  };


  @ViewChild('changeIMG') inputChangeIMG!: ElementRef;


  constructor(
    private listaService: ListaService,
    private cancionListaReproduccion: CancionListaReproduccionService,
    private activateRoute: ActivatedRoute,
    private cancionService: CancionService,
    private alertService: AlertasServices,
    private spinnerService: SpinnerService,
    private fb: FormBuilder,
    private campoValido: CampoValidoService,
    private validadoresService: ValidadoresService,
    private usuariosInvitadosService: UsuariosInvitadosService,
    private usuarioService: UsuarioService,
    private router: Router,
    private reproductorService: ReproductorService
    )
  {
    this.crearFormularioListaReproduccion();
    this.crearFormularioInvitados();
  }

  ngOnInit(): void {
    this.activatedRouteConsulta();
  }

  
  activatedRouteConsulta() {

    this.cancionesArray = [];
    this.usuariosInvitadoArray = [];

    this.activateRoute.params.pipe(

      switchMap(({ idListaReproduccion }) => this.listaService.consultarListaReproduccionPorId(idListaReproduccion)),
      map( (resServicioListaReproduccion) => {
        this.listaReproduccion = this.listaService.convertirAListaReproduccionInterface(resServicioListaReproduccion);
        return this.listaReproduccion.id;
      }),

  
      switchMap( (idListaReproduccion) => this.cancionListaReproduccion.consultarTodosCancionListaReproduccionPorLista(idListaReproduccion)),
      map( (resCancionListaService) => {
        this.ArrayCancionesId  = resCancionListaService;
        const newArrayCancionesIds = resCancionListaService.map( (cancionListaReproduccion: any) =>  cancionListaReproduccion.cancion);
        (newArrayCancionesIds) &&  (this.consultarCancionesPorIdMergeMap(newArrayCancionesIds)); 
        return this.listaReproduccion.id;
      }),


      switchMap( (idListaReproduccion) =>   this.usuariosInvitadosService.consultarUsuariosInvitadoPorListaReproduccion(idListaReproduccion)),
      tap( (resUsuariosInvitadosListaReproduccion) => {
        this.ArrayUsuariosIds = resUsuariosInvitadosListaReproduccion;
        const newArrayUsuariosIds = resUsuariosInvitadosListaReproduccion.map( (usuarioInvitado: any) =>  usuarioInvitado.usuario);
        (newArrayUsuariosIds) &&  (this.consultarUsuariosPorIdMergeMap(newArrayUsuariosIds));
      }),
    )
    .subscribe();
  }

  consultarCancionesPorIdMergeMap(arrayCancionesIds: any){
    this.cancionService.consultarCancionPorIdMergeMap(arrayCancionesIds).subscribe({
      next: (res) => this.cancionesArray.push(res)
    });
  }

  /* IMAGEN */

  seleccionarImagen() {
    this.imagenASubir = this.inputChangeIMG.nativeElement.files[0];
    const file = this.inputChangeIMG.nativeElement.files[0];
    const arrayValorerFileName = file.type.split('/');
    const extension = arrayValorerFileName[1];
    const extensionesValidas = ['png', 'jng', 'jpeg', 'gif', 'jpg'];

    if (!file) return;


    if (!extensionesValidas.includes(extension)) {
      this.alertService.alertaErrorMs('Archivo no permitido');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file); // Aqui lo convieete
    reader.onloadend = () => { this.imagenTemporal = reader.result; };
    this.banderas.cancelarFoto = true;
    this.banderas.guardarFoto = true;
    this.banderas.agregarFoto = false;

  }

  cancelarFotoSeleccionado() {

    this.imagenTemporal = null;
    this.banderas.cancelarFoto = false;
    this.banderas.guardarFoto = false;
    this.banderas.agregarFoto = true;
  }

  guardarFoto() {
    if (!this.imagenASubir) return;

    this.spinnerService.setSpinner = true;
    this.listaService.guardarImagenLista(this.imagenASubir, this.listaReproduccion.id)
    .subscribe({
      next: () => {
        this.spinnerService.setSpinner = false;
        this.alertService.alertaExito('Imagen Guardado exitosamente');
        this.activatedRouteConsulta();
      },
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });
    this.cancelarFotoSeleccionado();
  }

  eliminarFoto() {
    const imagenURL = this.listaReproduccion.imagenURL;

    if (this.valoresNoValidos.includes(imagenURL)) {
      this.alertService.alertaAdvertercia('¡ No se cuenta con una Imagen que eliminar !');
      return;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres eliminar la imagen', 'si')
      .then((result) => {
        if (result.isConfirmed) {
          this.listaService.eliminarImagenListaReproduccion(this.listaReproduccion.id)
          .subscribe({
            next: () => {
              this.alertService.alertaExito('Se elimino exitosamente');
              this.activatedRouteConsulta();
            },
            error: () => this.alertService.alertaErrorMs('Error en el servicio')
          });
        }
      });
  }

  // Formulario Actulizar Lista

  mostrarFormularioActualizarData() {

    (this.banderas.mostrarFormularioUpdateDataListaReproduccion) 
      ?(this.banderas.mostrarFormularioUpdateDataListaReproduccion = false)
      :(this.campoValido.miFormulario = this.formListaReproduccion,
        this.banderas.mostrarFormularioUpdateDataListaReproduccion = true,
        this.resetFormularioListaReproduccion())
  }
  
  esCampoValido(campo: string): Boolean { return this.campoValido.esValidoCampo(campo) }


  crearFormularioListaReproduccion() {
    this.formListaReproduccion = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      usuario: ['', [Validators.required]],
    });
  }

  resetFormularioListaReproduccion() {
    this.formListaReproduccion.reset({
      nombre: this.listaReproduccion.nombre,
      usuario: this.listaReproduccion.usuario,
    });
  }

  guardarCambiosListaReproduccionModificado() {

    if (this.formListaReproduccion.invalid) {
      this.formListaReproduccion.markAllAsTouched();
      return;
    }

    this.alertService.alertaPreguta('Estas seguro', 'Quieres guardar los cambios', 'si')
      .then((result) => {
        if (result.isConfirmed) {
          this.listaService.actualizarDatosBasicosListaReproduccion(this.listaReproduccion.id, this.formListaReproduccion.value)
            .subscribe({
              next: (res: any) => {
                if (res.ok) {
                  this.alertService.alertaExito('Se realizaron los cambios de manera exitosa');
                  this.mostrarFormularioActualizarData();
                  this.activatedRouteConsulta();
                } else {
                  const message: string = res.message.error.mensaje;
                  this.alertService.alertaErrorMs(message);
                }
              },
              error: () => this.alertService.alertaErrorMs('Error en la petición del servicio.')
          });
        }
      });
  }

  // Formulario Agregar Invitados

  crearFormularioInvitados() {
    this.formInvitados = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetFormularioInvitados() {

    this.formInvitados.reset({
      email: ''
    });

  }

  mostrarFormularioAgregarInvitado() {

    (this.banderas.mostrarFormularioAgregarInvitado) 
      ?(this.banderas.mostrarFormularioAgregarInvitado = false) 
      :(this.campoValido.miFormulario = this.formInvitados,
        this.banderas.mostrarFormularioAgregarInvitado = true);
  }

  guardarNuevoInvitado() {

    if (this.formInvitados.invalid) {
      this.formInvitados.markAllAsTouched();
      return;
    }

    const email = this.formInvitados.get('email')?.value;

    if (email === this.usuarioService.getUsuario.email) return this.alertService.alertaAdvertercia('Estás ingresando tu propío Email');

    this.usuarioService.consultarUsuarioPorEmail(email)
      .pipe(
        map((resUsuarioService: any) => {

          if (resUsuarioService.ok && resUsuarioService.data.length > 0) return resUsuarioService.data[0];

          this.alertService.alertaAdvertercia('El email no existe');
          return '';
        }),
        switchMap((res) => {
          if (res !== null) {
            const data = {
              listaReproduccion: this.listaReproduccion.id,
              usuario: res._id
            }
            return this.usuariosInvitadosService.crearUsuariosInvitados(data);
          }
          return '';
        })
      ).subscribe({
        next: (res: any) => {
          (res.ok) && (this.alertService.alertaExito('Se Agrego el invitado de manera exitosa'), this.activatedRouteConsulta() , this.resetFormularioInvitados());
          (res.ok) ?? (this.alertService.alertaErrorMs('No se pudo agregar el invitado'));
          this.mostrarFormularioAgregarInvitado();
        }
      })
  }



  consultarUsuariosPorIdMergeMap(arrayusuariosIds: any) {
    this.usuarioService.consultarUsuarioPorIdMergeMap(arrayusuariosIds)
    .subscribe({
      next: (res) => this.usuariosInvitadoArray.push(res)
    });    
  }

  eliminarInvitado(correoUsuario: string) {

    this.usuarioService.consultarUsuarioPorEmail(correoUsuario)
    .pipe(
      (
        switchMap( (res: any) => {
          const usuarioId = res.data[0]._id;
          const usuarioInvitadoAEliminar = this.ArrayUsuariosIds.filter( (element: any) => element.usuario === usuarioId)
          return this.usuariosInvitadosService.eliminarUsuariosInvitadoPorListaReproduccion(usuarioInvitadoAEliminar[0]._id);
        })
      )
    )
    .subscribe({
      next: () => {
        this.alertService.alertaExito("Usuario Invitado Eliminado Exitosamente");
        this.activatedRouteConsulta();
      },
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    });
  }

  /* CANCION */

  cancionListaReproduccionAReproducir(idCancion: string){
    this.reproductorService.isListaReproduccion = true;
    this.reproductorService.setActivo = true;
    const cancionAReproducir = this.ArrayCancionesId.filter( (element: any) =>  element.cancion === idCancion );
    this.reproductorService.cancionSeleccionadaDesdeLista(cancionAReproducir[0]._id);
  }

  verMasDelCancionListaReproduccion(idCancion: string){
    this.router.navigate(['usuario/cancion/verUno', idCancion]);
  }

  eliminarCancionListaReproduccion(idCancion: string){

    const cancionAEliminar = this.ArrayCancionesId.filter( (element: any) =>  element.cancion === idCancion );

    this.cancionListaReproduccion.eliminarCancionListaReproduccionPorLista(cancionAEliminar[0]._id)
    .subscribe({
      next: () => {
        this.alertService.alertaExito("Canción Eliminado Exitosamente");
        this.activatedRouteConsulta();
      },
      error: () => this.alertService.alertaErrorMs('Error en el servicio')
    })
  }
}
