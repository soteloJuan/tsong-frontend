/* Servicios relacionados con el administrador */


import {Injectable} from '@angular/core';

// Enviroment
import {environment} from '../../environments/environment.prod';


// http
import {HttpClient} from '@angular/common/http';

// rxjs


@Injectable({
    providedIn: 'root'
})


export class UltimaCancionService{

    private baseUrl: string = environment.base_url;

    constructor(
        private http: HttpClient,
        ){
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

    crearUltimaCancion(idUsuario: string, idCancion: string){
        const data = {
            cancion:idCancion,
            usuario: idUsuario
        };

        return this.http.post(`${this.baseUrl}api/ultimaCancion/create`, data, this.headers);
    }


    getUltimaCancion(idUsuario: string){
        return this.http.get(`${this.baseUrl}api/ultimaCancion/get/${idUsuario}`, this.headers);
    }


    updateUltimaCancion(idUltimaCancion: string, idCancion: string, idUsuario: string){
        const body = {
            cancion: idCancion,
            usuario: idUsuario
        };

        return this.http.put(`${this.baseUrl}api/ultimaCancion/update/${idUltimaCancion}`, body, this.headers);
    }

}
