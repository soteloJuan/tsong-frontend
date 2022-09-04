import {Injectable} from '@angular/core';

// servicios
import { ArtistaService } from '../artista/services/artista.service';
import { AlbumService } from '../album/services/album.service';
import { ListaService } from '../lista/services/lista.service';
import { CancionService } from '../cancion/services/cancion.service';
import {CancionListaReproduccionService} from '../lista/services/cancionListaReproduccion.service';
import {AlertasServices} from '../services/alertas.service';

// interface
import { ArtistaInterface } from '../artista/interfaces/artista.interface';
import { AlbumInterface } from '../album/interfaces/album.interface';
import { ListaInterface } from '../lista/interfaces/lista.interface';
import { CancionInterface } from '../cancion/interfaces/cancion.interface';

// rxjs
import { switchMap, map, tap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})


export class ReproductorService{


    private activo =  false;


    cancion!: CancionInterface;
    artista!: ArtistaInterface;
    album!: AlbumInterface;
    listaReproducion!: ListaInterface;
    listaCanciones!: any[];

    // Variables ListaReproductor
    cancionListaReproducion: any;
    arrayCancionesListaReproduccion!: any[];

    
    // Variables para el reproductor
    track = document.createElement('audio');


    numeroCancionReproduccion = 1;
    indiceCancionEnReproduccion = 0;
    totalCanciones!: number;
    porcantajeVolumen = 100;
    
    tiempoDeReproduccionPresente = 0;
    isPlay = false;
    isMuteSong = false;
    isAutoPlay = false;
    isListaReproduccion = false;


    temp: any;

    set setActivo(activo: boolean){
        this.activo = activo
    }
    get getActivo(){
        return this.activo;
    }

    constructor(
        private artistaService: ArtistaService,
        private albumService: AlbumService,
        private listaService: ListaService,
        private cancionService: CancionService,
        private cancionListaReproduccionService: CancionListaReproduccionService,
        private alertasServices: AlertasServices
    ){}


    public consultarUltimaCancionReproducida(){

        // AQUI EN ULTIMA CANCION REPRODUCIDA SERIA BUENO DEJAER UNA CANCION POR DEFECTO, PARA QUE SIEMPRE HAYA UNA CANCION idCancion = "613d2e90fad78f0016fb8920"
        this.cancionService.consultarCancionPorId("613d2e90fad78f0016fb8920")
        .pipe(
            map((resCancion: any) => {
                this.cancion = this.cancionService.convertirACancionInterface(resCancion.data);
                return this.cancion.album;
            }),

            switchMap((idAlbum) =>  this.albumService.consultarAlbumPorId(idAlbum)),
            map((resAlbum: any) => {
                this.album = this.albumService.convertirAAlbumInterface(resAlbum.data)
                return this.album.artista;
            }),

            switchMap((idArtista) => this.artistaService.consultarArtistasPorId(idArtista)),
            map((resArtista: any) => {
                this.artista = this.artistaService.convertirAArtistaInterface(resArtista.data);
            })
        ).subscribe(
            (res) => {
                // console.log('Este es el artista : ', this.artista);
                // console.log('Este es el Album : ', this.album);
                // console.log('Este es la cancion : ', this.cancion);
                // this.consultarCancionesPorIdAlbum(this.album.id);
            }
        )
    }

    public cancionSeleccionadaDesdeAlbum(idCancion: string){    

        this.cancionService.consultarCancionPorId(idCancion)
        .pipe(
            map((resCancion: any) => {
                this.cancion = this.cancionService.convertirACancionInterface(resCancion.data);
                return this.cancion.album;
            }),
            switchMap((idAlbum) =>  this.albumService.consultarAlbumPorId(idAlbum)),
            map((resAlbum: any) => {
                this.album = this.albumService.convertirAAlbumInterface(resAlbum.data)
                return this.album.artista;
            }),

            switchMap((idArtista) => this.artistaService.consultarArtistasPorId(idArtista)),
            map((resArtista: any) => {
                this.artista = this.artistaService.convertirAArtistaInterface(resArtista.data);
            })

        ).subscribe({
            next: () => {
                this.playCancion();
                this.isPlay = true;
                this.consultarCancionesPorIdAlbum(this.album.id);
            }
        }) 
    }

    public cancionSeleccionadaDesdeLista(idCancion: string){    

        this.listaCanciones = [];

        this.cancionListaReproduccionService.consultarCancionListaReproduccionPorId(idCancion)
        .pipe(
        
            switchMap( (resCancionListaReproduccion: any) => {
                this.cancionListaReproducion = resCancionListaReproduccion;
                return   this.cancionService.consultarCancionPorId(this.cancionListaReproducion.cancion);
            }),
            map( (resCancionService: any) => {
                this.cancion = this.cancionService.convertirACancionInterface(resCancionService.data);
                return this.cancion.artista;
            }),

            switchMap( (idArtista) => this.artistaService.consultarArtistasPorId(idArtista)),
            map( (resArtistaService: any) => {
                this.artista = this.artistaService.convertirAArtistaInterface(resArtistaService.data);
                return this.cancionListaReproducion.listaReproduccion;
            }),

            switchMap( (idListaReproduccion) => this.listaService.consultarListaReproduccionPorId(idListaReproduccion)),
            map( (resListaService: any) => {
                this.listaReproducion = this.listaService.convertirAListaReproduccionInterface(resListaService);
                return this.listaReproducion.id;
            }),

            switchMap( (idlistaReproduccion: any) => this.cancionListaReproduccionService.consultarTodosCancionListaReproduccionPorLista(idlistaReproduccion)),

            tap( (resCancionListaReproduccionService: any) => {
                this.arrayCancionesListaReproduccion = resCancionListaReproduccionService;
                const newArrayCancionesIds = resCancionListaReproduccionService.map( (cancionListaReproduccion: any) =>  cancionListaReproduccion.cancion);
                (newArrayCancionesIds) &&  (this.consultarCancionesPorIdMergeMap(newArrayCancionesIds));
            }),
        )
        .subscribe({
            next: () => {
                this.playCancion();
                this.isPlay = true;
            }
        });
    }

    async consultarCancionesPorIdMergeMap(arrayCancionesIds: any) {
        this.cancionService.consultarCancionPorIdMergeMap(arrayCancionesIds)
        .subscribe({
            next: (res: any) => {
                this.listaCanciones.push(res);
                this.asignacionNumeros();
            }
        });
    }

    async listaSeleccionada(idListaSeleccionada: string){

        this.listaCanciones = [];

        this.cancionListaReproduccionService.consultarTodosCancionListaReproduccionPorLista(idListaSeleccionada)
        .pipe(
            tap( (resCancionListaReproduccionService: any) => {

                this.arrayCancionesListaReproduccion = resCancionListaReproduccionService;

                let newArrayCancionesIds;
                if(this.arrayCancionesListaReproduccion){
                    newArrayCancionesIds = resCancionListaReproduccionService.map( (cancionListaReproduccion: any) =>  cancionListaReproduccion.cancion);
                }

                (newArrayCancionesIds) &&  (this.consultarCancionesPorIdMergeMap(newArrayCancionesIds));

            })
        ).subscribe({
            next: () => {
                setTimeout(() => {
                    if(this.listaCanciones.length !== 0){
                        this.cancion = this.cancionService.convertirACancionInterface(this.listaCanciones[0]);
                        this.consultarArtistaSegunCancion();
                        this.playCancion();
                        this.isPlay = true;
                    }else{
                        this.setActivo = false;
                        this.alertasServices.alertaAdvertercia('No tiene canciones para reproducir');
                    }
                },2000);
            }
        })
    }

  // REPRODUCIR ALBUM FINISHED
    albumSeleccionada(idAlbumSeleccionada: string){

        this.albumService.consultarAlbumPorId(idAlbumSeleccionada)
        .pipe(
            map((resAlbum: any) => {
                this.album = this.albumService.convertirAAlbumInterface(resAlbum.data)
                return this.album.artista;
            }),

            switchMap((idArtista) => this.artistaService.consultarArtistasPorId(idArtista)),
            map((resArtista: any) => {
                this.artista = this.artistaService.convertirAArtistaInterface(resArtista.data);
                return this.album.id;
            }),

            switchMap( (idAlbum) => this.cancionService.consultarCancionesPorAlbum(idAlbum)),
            tap( (resCanciones: any) => {
                this.listaCanciones = resCanciones.data;
                this.cancion = this.cancionService.convertirACancionInterface(this.listaCanciones[0]);
                this.asignacionNumeros();
            })

        ).subscribe({
            next: () => {
                this.playCancion();
                this.isPlay = true;
            }
        })
    }

    playCancion(){
        this.track.src = this.cancion.cancionURL;
        this.track.load();
        this.track.play();
    }

    playOrPause(){
        (this.isPlay) ? (this.track.pause(), this.isPlay = false) : (this.track.play(), this.isPlay = true);
    }
    
    async nextSong(){

        const numeroSiguiente = this.numeroCancionReproduccion + 1;

        if(numeroSiguiente <= this.totalCanciones){
            this.cancion = this.cancionService.convertirACancionInterface(this.listaCanciones[this.indiceCancionEnReproduccion + 1]);
            if(this.isListaReproduccion)this.consultarArtistaSegunCancion();
        }

        await this.asignacionNumeros();
        this.playCancion();
        this.isPlay = true;
    }
    
    async previousSong(){
        const numeroAnterior = this.numeroCancionReproduccion - 1;

        if(numeroAnterior >= 1){
            this.cancion = this.cancionService.convertirACancionInterface(this.listaCanciones[this.indiceCancionEnReproduccion - 1]);
            if(this.isListaReproduccion)this.consultarArtistaSegunCancion();
        }

        await this.asignacionNumeros();
        this.playCancion();
    }
    
    changeVolume(e: any){
        this.track.volume = e.value / 100;
        this.porcantajeVolumen = this.track.volume * 100;

        (this.track.volume === 0) ? (this.muteSong()) : (this.isMuteSong = false)
        
    }
    
    muteSong(){
        (!this.isMuteSong) 
            ? (this.isMuteSong = true,
                this.track.volume = 0)
            :(this.isMuteSong = false,
                this.track.volume = this.porcantajeVolumen / 100)
    }

    cambioDeTiempoCancion(valorPorcentaje: any){
        this.track.currentTime = this.track.duration * (valorPorcentaje / 100);
        this.tiempoDeReproduccionPresente = this.track.currentTime * (100 / this.track.duration);
    }

    repetirCancion(){
        (this.isAutoPlay) ?(this.isAutoPlay = false) :(this.isAutoPlay = true)
    }

    consultarCancionesPorIdAlbum(idAlbum: string){
        this.cancionService.consultarCancionesPorAlbum(idAlbum)
        .subscribe({
            next: (res: any) => {
                this.listaCanciones = res.data;
                this.asignacionNumeros();
            }
        });
    }

    async asignacionNumeros(){
        this.indiceCancionEnReproduccion = await this.listaCanciones.findIndex((cancionDeLista: any) => cancionDeLista._id === this.cancion.id);
        this.numeroCancionReproduccion = this.indiceCancionEnReproduccion + 1 ;
        this.totalCanciones = this.listaCanciones.length;
    }

    consultarArtistaSegunCancion(){
        this.artistaService.consultarArtistasPorId(this.cancion.artista)
        .subscribe({
            next: (res: any) => this.artista = this.artistaService.convertirAArtistaInterface(res.data)
        });
    }

}
