import {Injectable} from '@angular/core';


// Enviroment
import {environment} from '../../../environments/environment.prod';


// http
import {HttpClient} from '@angular/common/http';

// interfaces


// rxjs
import { map, catchError, tap, concatMap } from 'rxjs/operators';
import { of, from, Subscribable } from 'rxjs';



@Injectable({
    providedIn: 'root'
})



export class CancionListaReproduccionService{
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

    consultarCancionListaReproduccionPorId(idCancionListaReproduccion: string){
        return this.http.get(`${this.baseUrl}api/cancionListaReproduccion/get/${idCancionListaReproduccion}`, this.headers).pipe(
            map( (res: any) => {
                return res.data;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }



    consultarTodosCancionListaReproduccionPorLista(idListaReproduccion: string){
        return this.http.get(`${this.baseUrl}api/cancionListaReproduccion/gets/${idListaReproduccion}`, this.headers).pipe(
            map( (res: any) => {
                return res.data;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    eliminarCancionListaReproduccionPorLista(idCancionListaReproduccion: string){
        return this.http.delete(`${this.baseUrl}api/cancionListaReproduccion/delete/${idCancionListaReproduccion}`, this.headers)
        .pipe( 
            tap( (res: any) => {
                // console.log('eliminar : ', res);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }




}