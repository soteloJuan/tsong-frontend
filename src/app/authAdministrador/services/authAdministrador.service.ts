/* Servicios relacionado con la autenticacion y logueo del administrador */

import {Injectable} from '@angular/core';

// Services
import { MenuService } from '../../services/menu.service';
import {AdministradorService} from '../../administrador/services/administrador.service';

// Http
import {HttpClient} from '@angular/common/http';

// Enviroment
import {environment} from '../../../environments/environment.prod';

// Interfaces
import { LoginFormValue } from '../interfaces/loginFormValue.inteface';
import { AdministradorInterface } from '../../administrador/interfaces/administrador.interface';

// rxjs
import {map, tap, catchError} from 'rxjs/operators';
import {of, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})


export class AuthAdministradorService{

    private baseUrl: string = environment.base_url;

    constructor(private http: HttpClient, private menuService: MenuService,
        private administradorService: AdministradorService){
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

    asignarMenuAdminPro(){
        localStorage.setItem('menu', this.menuService.menuAdminPro());
    }
    asignarMenuAdmin(){
        localStorage.setItem('menu', this.menuService.menuAdmin());
    }

    login(datos: LoginFormValue){

        const url = `${this.baseUrl}api/authAdministrador/login`;

        return this.http.post(url, datos).pipe(
            tap( (resp: any) => {
                this.guardartoken(resp.token);
                const data: AdministradorInterface = this.administradorService.formatoParaAdministrador(resp.data);
                this.administradorService.asignarDatos(data);
                (this.administradorService.getAdministrador.role == "ADMIN_PRO") ? (this.asignarMenuAdminPro()) : (this.asignarMenuAdmin());
            }),
            catchError( (error) => {
                return of ({ok: false, message: error});
            })
        );
    }

    guardartoken(token: string){
        localStorage.setItem('token', token);
    }

    validarToken(): Observable<boolean>{
        return this.http.get(`${this.baseUrl}api/authAdministrador/renew`, this.headers).pipe(
            map( (res: any) => {
                this.administradorService.consultarAdministrador(res.id).subscribe( (adminConsultado) => {
                    const data: AdministradorInterface = this.administradorService.formatoParaAdministrador(adminConsultado);
                    this.administradorService.asignarDatos(data);
                });
                this.guardartoken(res.token);
                return true;
            }),
            catchError((error) => of (false)) // Trabajar error con observable
        );
    }

}



