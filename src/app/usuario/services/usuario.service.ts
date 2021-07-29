import {Injectable} from '@angular/core';


// http
import {HttpClient} from '@angular/common/http';

// Enviroment
import {environment} from '../../../environments/environment.prod';

// rxjs
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';



@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    private baseUrl: string = environment.base_url;

    
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


    constructor(private http: HttpClient){
    }


    consultarTodosUsuarios(numeroPagina: number){
        return this.http.get(`${this.baseUrl}api/usuario/gets/${numeroPagina}`,this.headers)
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


    modificarDatosUsuario(id: string, data: any){
        return this.http.put(`${this.baseUrl}api/usuario/update/${id}`, data, this.headers)
        .pipe(
            tap(
                (res) => {
                    console.log('Respuesta de Modificar: ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    consultarUsuarioPorTermino(termino: string, pagina = 1){
        return this.http.get(`${this.baseUrl}api/usuario/search/${termino}/${pagina}`, this.headers)
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


    eliminarUsuario(idUsuario: string){
        return this.http.delete(`${this.baseUrl}api/usuario/delete/${idUsuario}`, this.headers)
        .pipe(
            tap(
                (res) => {
                    console.log('Respuesta servicio eliminar Usuario : ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }


}
