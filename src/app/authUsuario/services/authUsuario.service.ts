/* eslint-disable @typescript-eslint/no-empty-function */
import {Injectable, NgZone} from '@angular/core';

// Enviroment
import {environment} from '../../../environments/environment.prod';


// http
import {HttpClient} from '@angular/common/http';

// Servicios 
import { MenuService } from '../../services/menu.service';
import { UsuarioService } from '../../usuario/services/usuario.service';

// interfaces
import { UsuarioInterface } from '../../usuario/interfaces/usuarios.interfaces';

// rxjs
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

declare const gapi:any;


@Injectable({
    providedIn: 'root'
})


export class AuthUsuarioService{

    base_url = environment.base_url;
    public auth2: any;

    
    constructor(private http: HttpClient,
        private ngZone: NgZone,
        private menuService: MenuService,
        private usuarioService: UsuarioService
        ){
        this.googleInit();
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


    googleInit(){
        return new Promise( (resolve: any) => {
            gapi.load('auth2', () => {
                this.auth2 = gapi.auth2.init({
                    client_id: '947071755257-7rbgchpvlq32jlnec26s7sq05i40d0ll.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin',
                });
                resolve();
            });

        });
    }

    asignarMenuUsuario(){
        localStorage.setItem('menu', this.menuService.menuUser());
    }

    loginConEmailPassword(data: any){
        return this.http.post(`${this.base_url}api/authUsuario/login`, data)
        .pipe(
            tap(
                (res: any) => {
                    if(res.ok){
                        this.guardartoken(res.token);
                        const data: UsuarioInterface = this.usuarioService.formatoParaUsuario(res.data);
                        this.usuarioService.asignarDatos(data);
                        this.asignarMenuUsuario();
                    }
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }


    loginConGoogle(token: string){
        return this.http.post(`${this.base_url}api/authUsuario/login/google`, {token})
        .pipe(
            tap(
                (res: any) => {
                    if(res.ok){
                        this.guardartoken(res.token);
                        this.asignarMenuUsuario();
                    }
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }


    guardartoken(token: string){
        localStorage.setItem('token', token);
    }

    logout(){
        localStorage.removeItem('token');
        this.auth2.signOut().then(() =>{
            this.ngZone.run( () => {});
        });
    
    }


    validarToken(): Observable<boolean>{
        return this.http.get(`${this.base_url}api/authUsuario/renew`, this.headers).pipe(
            map( (res: any) => {
                this.usuarioService.consultarUsuarioPorId(res.id)
                .subscribe( (usuarioConsultado: any) => {
                    const data: UsuarioInterface = this.usuarioService.formatoParaUsuario(usuarioConsultado.data);
                    this.usuarioService.asignarDatos(data);
                });
                this.guardartoken(res.token);
                return true;
            }),
            catchError(() => of (false))
        );
    }
}