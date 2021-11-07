import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

// Services
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { ListaService } from '../../services/lista.service';
import { CancionListaReproduccionService } from '../../services/cancionListaReproduccion.service';
import { CancionService } from '../../../cancion/services/cancion.service';
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
  selector: 'app-ver-uno-compartidos',
  templateUrl: './ver-uno-compartidos.component.html',
  styleUrls: ['./ver-uno-compartidos.component.css']
})
export class VerUnoCompartidosComponent implements OnInit {

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
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private reproductorService: ReproductorService
  )
  {
  }

  /* VAMOS AQUI, SOLO FALTA OPTIMIZAR UN POCO EL CODIGO QUE VA AQUI */

  ngOnInit(): void {
    this.activatedRouteConsulta();
  }

  
  activatedRouteConsulta() {

    this.cancionesArray = [];

    this.activateRoute.params.pipe(

      switchMap(({ idListaReproduccion }) => this.listaService.consultarListaReproduccionPorId(idListaReproduccion)),
      map( (resServicioListaReproduccion) => {
        this.listaReproduccion = this.listaService.convertirAListaReproduccionInterface(resServicioListaReproduccion);
        return this.listaReproduccion.id;
      }),
  
      switchMap( (idListaReproduccion) => this.cancionListaReproduccion.consultarTodosCancionListaReproduccionPorLista(idListaReproduccion)),
      map( (resCancionListaService) => {
        this.ArrayCancionesId  = resCancionListaService;
        let newArrayCancionesIds = resCancionListaService.map( (cancionListaReproduccion: any) =>  cancionListaReproduccion.cancion);
        (newArrayCancionesIds) &&  (this.consultarCancionesPorIdMergeMap(newArrayCancionesIds)); 
        return this.listaReproduccion.id;
      })
    )
    .subscribe();
  }


  consultarCancionesPorIdMergeMap(arrayCancionesIds: any){
    this.cancionService.consultarCancionPorIdMergeMap(arrayCancionesIds).subscribe(
      (res: any) => {
        this.cancionesArray.push(res);
      },
      (error) => {
        console.log('Error en la peticion del servicio :', error);
      }
    );
  
  }


   // Formulario Actulizar Lista


  consultarUsuariosPorIdMergeMap(arrayusuariosIds: any) {
    this.usuarioService.consultarUsuarioPorIdMergeMap(arrayusuariosIds).subscribe(
      (res: any) => {
        this.usuariosInvitadoArray.push(res);
      },
      (error) => {
        console.log('Error en la peticion del servicio :', error);
      }
    );    
  }



  /* CANCION */

  cancionListaReproduccionAReproducir(idCancion: string){
    this.reproductorService.isListaReproduccion = true;
    this.reproductorService.setActivo = true;
    const cancionAReproducir = this.ArrayCancionesId.filter( (element: any) =>  element.cancion === idCancion );
    this.reproductorService.cancionSeleccionadaDesdeLista(cancionAReproducir[0]._id);
  }


  verMasDelCancionListaReproduccion(idCancion: string){
    console.log('Cancion ver Mas : ', idCancion);
    this.router.navigate(['usuario/cancion/verUno', idCancion]);
  }

}










