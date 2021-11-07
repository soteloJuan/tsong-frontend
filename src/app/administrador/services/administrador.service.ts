/* Servicios relacionados con el administrador */


import {Injectable} from '@angular/core';

// Enviroment
import {environment} from '../../../environments/environment.prod';

// Service
import {MenuService} from '../../services/menu.service';

// http
import {HttpClient} from '@angular/common/http';

// interfaces
import { AdministradorInterface } from '../interfaces/administrador.interface';


// rxjs
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})


export class AdministradorService{

    private baseUrl: string = environment.base_url;
    public administrador!: AdministradorInterface;

    constructor(
        private http: HttpClient,
        private menuService: MenuService
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

    get getAdministrador(){
        return this.administrador;
    }

    crearAdministrador(data: object){
        return this.http.post(`${this.baseUrl}api/administrador/create`, data, this.headers)
        .pipe(
            tap(
                (res) => {
                    // console.log('Esta es la respuesta de crear un administrador: ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    consultarAdministrador(idAdministrador: string){        
        return this.http.get(`${this.baseUrl}api/administrador/get/${idAdministrador}`, this.headers).pipe(
            map( (resp: any) => {
                return resp.data;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    consultarTodosAdministradores(numeroPagina: number){        
        return this.http.get(`${this.baseUrl}api/administrador/gets/${numeroPagina}`, this.headers).pipe(
            map( (res: any) => {
                return res.data;
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    consultarAdministradoresPorTermino(termino: string, pagina = 1){
        return this.http.get(`${this.baseUrl}api/administrador/search/${termino}/${pagina}`, this.headers)
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

    modificarDatosAdministrador(id: string, data: any){
        return this.http.put(`${this.baseUrl}api/administrador/update/${id}`, data, this.headers)
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

    guardarImagen(imagen: File, idAdministrador:string){

        let formData = new FormData;
        formData.append('imagen', imagen);

        return this.http.put(`${this.baseUrl}api/administrador/updateImagen/${idAdministrador}`, formData, this.headers)
        .pipe(
            tap( (resp: any) => {
                const dataFormateadoAdmin: AdministradorInterface = this.formatoParaAdministrador(resp.data);
                this.asignarDatos(dataFormateadoAdmin);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    eliminarImagen(){

        return this.http.delete(`${this.baseUrl}api/administrador/deleteImagen/${this.administrador.id}`, this.headers)
        .pipe( 
            tap( (res: any) => {
                const dataFormateadoAdmin: AdministradorInterface = this.formatoParaAdministrador(res.data);
                this.asignarDatos(dataFormateadoAdmin);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    actualizarAdministrador(data: Object, idAdministrador: string){
        return this.http.put(`${this.baseUrl}api/administrador/update/${idAdministrador}`, data, this.headers)
        .pipe(
            map( (res: any) => {
                console.log('Res', res);
                const dataFormateadoAdmin: AdministradorInterface = this.formatoParaAdministrador(res.data);
                this.asignarDatos(dataFormateadoAdmin);
                return res
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    actualizarAdministradorPassword(value: object, idAdministrador: string){

        return  this.http.put(`${this.baseUrl}api/administrador/updatePassword/${idAdministrador}`, value, this.headers)
        .pipe(
            tap( (res) => {
                // console.log('Respuesta del servicio updatePassword: ', res);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );



    }

    eliminarAdministrador(idAdministrador: string){
        return this.http.delete(`${this.baseUrl}api/administrador/delete/${idAdministrador}`, this.headers)
        .pipe(
            tap(
                (res) => {
                    console.log('Respuesta de servicio al eliminar : ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    formatoParaAdministrador(data: any): AdministradorInterface{
        const adminDataFormateado: AdministradorInterface = {
            id: data._id,
            apellidos: data.apellidos,
            bloqueado: data.bloqueado,
            confirmarCorreo: data.confirmarCorreo,
            email: data.email,
            imagenID: data.imagenID,
            imagenURL:  data.imagenURL,
            nombre: data.nombre,
            password: data.password,
            role: data.role
        };
        return adminDataFormateado as AdministradorInterface;
    }

    asignarDatos(data: AdministradorInterface){
        this.administrador = {...data};
        this.menuService.setRole = "ADMINISTRADOR";
    }

}





