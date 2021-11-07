import {Injectable} from '@angular/core';



// Enviroment
import {environment} from '../../../environments/environment.prod';


// http
import {HttpClient} from '@angular/common/http';

// interfaces
import { AlbumInterface } from '../interfaces/album.interface';

// rxjs
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';



@Injectable({
    providedIn: 'root'
})





export class AlbumService{
    private baseUrl: string = environment.base_url;

    constructor(private http: HttpClient){
    }

    get token(): string{
        return localStorage.getItem('token') || '';
    }

    get headers(){
        return {
            headers: {
                'token': this.token
            }
        };
    }

    crearAlbum(data: any){
        return this.http.post(`${this.baseUrl}api/album/create`, data, this.headers)
        .pipe(
            map(
                (res: any) => {
                    console.log('Respuesta Crear Album: ', res);
                    return res;
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    consultarAlbumPorId(idAlbum: string){

        return this.http.get(`${this.baseUrl}api/album/get/${idAlbum}`, this.headers).pipe(
            map( (res: any) => {
                return res;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    
    consultarTodosAlbums(numeroPagina: number){
        return this.http.get(`${this.baseUrl}api/album/gets/${numeroPagina}`, this.headers).pipe(
            map( (res: any) => {
                return res.data;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    consultarAlbumsPorIdArtista(idArtista: string){
        return this.http.get(`${this.baseUrl}api/album/gets/porArtista/${idArtista}`, this.headers)
        .pipe(
            tap(
                (res) => {
                    // console.log('Esta es la respuesta de la consulta: ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
    }

    consultarAlbumsPorIdArtistaPaginado(idArtista: string, pagina: number){
        return this.http.get(`${this.baseUrl}api/album/gets/porArtistaPaginado/${idArtista}/${pagina}`, this.headers)
        .pipe(
            tap(
                (res) => {
                    // console.log('Esta es la respuesta de la consulta: ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
    }


    consultarAlbumsPorTermino(termino: string, pagina = 1){
        return this.http.get(`${this.baseUrl}api/album/search/${termino}/${pagina}`, this.headers)
        .pipe(
            map(
                (res: any) => {
                    return res.data;
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }


    guardarImagenAlbum(imagen: File, idAlbum:string){

        let formData = new FormData;
        formData.append('imagen', imagen);

        return this.http.put(`${this.baseUrl}api/album/updateImagen/${idAlbum}`, formData, this.headers)
        .pipe(
            tap( (res: any) => {
                console.log('Respuesta UpdataPhoto: ',res);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    actualizarDatosBasicosAlbum(idAlbum: string, data: any){
        
        return this.http.put(`${this.baseUrl}api/album/update/${idAlbum}`, data, this.headers)
        .pipe(
            tap( (res: any) => {
                console.log('Respuesta Actualizacion de Album: ',res);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
    }


    eliminarImagenAlbum(idAlbum: string){

        return this.http.delete(`${this.baseUrl}api/album/deleteImagen/${idAlbum}`, this.headers)
        .pipe( 
            tap( (res: any) => {
                // console.log(res);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
    }


    eliminarAlbum(idAlbum: string){
        return this.http.delete(`${this.baseUrl}api/album/delete/${idAlbum}`, this.headers)
        .pipe(
            tap(
                (res) => {
                    // console.log('Respuesta de servicio al eliminar : ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
    }



    convertirAAlbumInterface(data: any): AlbumInterface{

        const album: AlbumInterface = {
            id: data._id,
            bloqueado: data.bloqueado,
            descripcion: data.descripcion,
            fechaLanzamiento: data.fechaLanzamiento,
            imagenID: data.imagenID,
            imagenURL: data.imagenURL,
            nombre: data.nombre,
            artista: data.artista,
        }

        return album;;
        
    }






}


