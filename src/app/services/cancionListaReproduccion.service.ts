import {Injectable} from '@angular/core';


// Enviroment
import {environment} from '../../environments/environment.prod';


// http
import {HttpClient} from '@angular/common/http';

// interfaces


// rxjs
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';



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


    crearCancionListaReproduccion(data: any){
        return this.http.post(`${this.baseUrl}api/cancionListaReproduccion/create`, data ,this.headers)
        .pipe(
            tap(
                (res) => {
                    console.log('Esta es la respuesta de crear una cancionListaReproduccion: ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )

    }

    

}