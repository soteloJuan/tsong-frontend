import {Injectable} from '@angular/core';


// Enviroment
import {environment} from '../../../environments/environment.prod';


// http
import {HttpClient} from '@angular/common/http';

// interfaces
import { ListaInterface } from '../interfaces/lista.interface';


// rxjs
import { map, catchError, tap, mergeMap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';



@Injectable({
    providedIn: 'root'
})



export class ListaService{
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

    crearLista(data: any){
        return this.http.post(`${this.baseUrl}api/listaReproduccion/create`, data, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    actualizarDatosBasicosListaReproduccion(idListaReproduccion: string, data: any){
        
        return this.http.put(`${this.baseUrl}api/listaReproduccion/update/${idListaReproduccion}`, data, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    guardarImagenLista(imagen: File, idArtista:string){

        const formData = new FormData;
        formData.append('imagen', imagen);

        return this.http.put(`${this.baseUrl}api/listaReproduccion/updateImagen/${idArtista}`, formData, this.headers)
        .pipe(
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarListaReproduccionPorId(idListaReproduccion: string){
        return this.http.get(`${this.baseUrl}api/listaReproduccion/get/${idListaReproduccion}`, this.headers)
        .pipe(
            map(
                (res: any) => {
                    return res.data;
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }


    consultarListaReproduccionPorIdMergeMap(idsListaReproduccionArry: []){

        return from(idsListaReproduccionArry).pipe(
            mergeMap((id) => <Observable<any>> this.http.get(`${this.baseUrl}api/listaReproduccion/get/${id}`, this.headers) ),
            map( (res: any) => res.data)
        );
    }



    consultarTodosListaPorUsuarios(idUsuario: string ,numeroPagina: number){
        return this.http.get(`${this.baseUrl}api/listaReproduccion/gets/${idUsuario}/${numeroPagina}`, this.headers).pipe(
            map( (res: any) => {
                return res.data;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarListaReproduccionGeneral(pagina: number){
        return this.http.get(`${this.baseUrl}api/listaReproduccion/getsGeneral/${pagina}`, this.headers)
        .pipe(
            map(
                (res: any) => {
                    return res.data;
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarListaPorTermino(idUsuario: string, termino: string, pagina = 1){
        return this.http.get(`${this.baseUrl}api/listaReproduccion/search/${idUsuario}/${termino}/${pagina}`, this.headers)
        .pipe(
            map(
                (res: any) => {
                    return res.data;
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    consultarListaGeneralPorTermino(termino: string, pagina = 1){
        return this.http.get(`${this.baseUrl}api/listaReproduccion/searchGeneral/${termino}/${pagina}`, this.headers)
        .pipe(
            map(
                (res: any) => {
                    return res.data;
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }


    eliminarListaReproduccionPropio(idListaReproduccion: string){
        return this.http.delete(`${this.baseUrl}api/listaReproduccion/delete/${idListaReproduccion}`, this.headers)
        .pipe( 
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    eliminarImagenListaReproduccion(idListaReproduccion: string){

        return this.http.delete(`${this.baseUrl}api/listaReproduccion/deleteImagen/${idListaReproduccion}`, this.headers)
        .pipe( 
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    convertirAListaReproduccionInterface(data: any): ListaInterface{
        const listaReproduccion: ListaInterface = {
            id: data._id,
            imagenID: data.imagenID,
            imagenURL: data.imagenURL,
            nombre: data.nombre,
            usuario:data.usuario
        };
        return listaReproduccion;

    }

}
