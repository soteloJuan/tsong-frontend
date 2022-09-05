import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// services
import { ListaService } from '../../services/lista.service';
import { AlertasServices } from '../../../services/alertas.service';
import { UsuarioService } from '../../../usuario/services/usuario.service';
import { UsuariosInvitadosService } from '../../services/usuariosInvitados.service';
import {ReproductorService} from '../../../services/reproductor.service';

// rxjs
import { switchMap, map } from 'rxjs/operators';

// Routes
import {Router} from '@angular/router';

@Component({
  selector: 'app-ver-listas-compartidos',
  templateUrl: './ver-listas-compartidos.component.html',
  styleUrls: ['./ver-listas-compartidos.component.css']
})

export class VerListasCompartidosComponent implements OnInit {

  arrayListas: any[] = [];

  @ViewChild('termino') termino!: ElementRef;

  constructor(
    private listaService: ListaService,
    private alertService: AlertasServices,
    private usuarioService: UsuarioService,
    private router: Router,
    private usuariosInvitadosService: UsuariosInvitadosService,
    private reproductorService: ReproductorService
  ) { }


  ngOnInit(): void {
    const SetTimeout = setTimeout(() => {
      this.consultaUsuariosInvitados();
    }, 300);
    SetTimeout;
  }

  consultaUsuariosInvitados(){
    this.usuariosInvitadosService.consultarUsuariosInvitadosPorIdUsuario(this.usuarioService.getUsuario.id)
    .pipe(
      map( (data: any) => {  
        let nuevoArray = [];
        nuevoArray = data.map( (element: any) => element.listaReproduccion);
        return nuevoArray;
      }),

      switchMap((arrayIdsListasReproduccion: any) => this.listaService.consultarListaReproduccionPorIdMergeMap(arrayIdsListasReproduccion))

      ).subscribe({
        next: (res) => this.arrayListas.push(res)
      });
  }

  reproducirListaReproduccion(idLista: string){
    this.reproductorService.isListaReproduccion = true;
    this.reproductorService.setActivo = true;
    this.reproductorService.listaSeleccionada(idLista);
  }

  verMasListaReproduccion(idListaReproduccion: string){
    this.router.navigate(['usuario/lista/verUnoCompartidos', idListaReproduccion]);
  }

}
