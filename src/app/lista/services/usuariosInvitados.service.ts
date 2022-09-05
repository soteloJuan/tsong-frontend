import { Injectable } from '@angular/core';


// Enviroment
import { environment } from '../../../environments/environment.prod';


// http
import { HttpClient } from '@angular/common/http';

// interfaces
import { ListaInterface } from '../interfaces/lista.interface';


// rxjs
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';



@Injectable({
    providedIn: 'root'
})

export class UsuariosInvitadosService {
    private baseUrl: string = environment.base_url;

    constructor(private http: HttpClient) {
    }

    get token(): string {
        return localStorage.getItem('token') || '';
    }

    get headers() {
        return {
            headers: {
                'token': this.token
            }
        };
    }

    crearUsuariosInvitados(data: any) {
        return this.http.post(`${this.baseUrl}api/usuariosInvitados/create`, data, this.headers)
            .pipe(
                map(
                    (res: any) => {
                        // console.log('Respuesta Crear una Lista de Reproducción: ', res);
                        return res;
                    }
                ),
                catchError((error) => {
                    return of({ ok: false, message: error });
                })
            );
    }


    consultarUsuariosInvitadoPorListaReproduccion(idListaReproduccion: string) {
        return this.http.get(`${this.baseUrl}api/usuariosInvitados/gets/${idListaReproduccion}`, this.headers)
            .pipe(
                map(
                    (res: any) => {
                        return res.data;
                    }
                ),
                catchError((error) => {
                    return of({ ok: false, message: error });
                })
            );
    }




    consultarListaReproduccionCompartidasPorIdUsuario(idUsuario: string) {

        return this.http.get(`${this.baseUrl}api/usuariosInvitados/gets/${idUsuario}`, this.headers)
            .pipe(
                map(
                    (res: any) => {
                        // console.log('RES usuariosInvitados : ', res);
                        return res.data;
                    }
                ),
                catchError((error) => {
                    return of({ ok: false, message: error });
                })
            );

    }

    consultarUsuariosInvitadosPorIdUsuario(idUsuario: string) {

        return this.http.get(`${this.baseUrl}api/usuariosInvitados/gets/porUsuario/${idUsuario}`, this.headers)
        .pipe(
            map(
                (res: any) => {
                    // console.log('RES usuariosInvitados : ', res);
                    return res.data;
                }
            ),
            catchError((error) => {
                return of({ ok: false, message: error });
            })
        );

    }
    // AQUI VAMOS TENEMOS QUE CREAR UN SERVICIO, PARA CONSULTAR TODOS LOS USUARIOS INVITAOD Y EN BASE A ESA RESPUESTA CONSULTAR LAS LISTAS DE REPRODUCCION



    eliminarUsuariosInvitadoPorListaReproduccion(idUsuarioInvitado: string) {

        return this.http.delete(`${this.baseUrl}api/usuariosInvitados/delete/${idUsuarioInvitado}`, this.headers)
            .pipe(
                tap((res: any) => {
                }),
                catchError((error) => {
                    return of({ ok: false, message: error });
                })
            );

    }







}


