import {Injectable} from '@angular/core';


// Servicio
import {MenuService} from '../../services/menu.service';


// http
import {HttpClient} from '@angular/common/http';

// Enviroment
import {environment} from '../../../environments/environment.prod';

// rxjs
import { map, catchError, tap, mergeMap } from 'rxjs/operators';
import { from, Observable, of  } from 'rxjs';

// interfaces 
import { UsuarioInterface } from '../interfaces/usuarios.interfaces';


@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    private baseUrl: string = environment.base_url;
    public usuario!: UsuarioInterface;
    
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

    get getUsuario(){
        return this.usuario;
    }

    constructor(
        private http: HttpClient,
        private menuService: MenuService
        ){
    }

    crearUsuarioNuevo(data: any){
        return this.http.post(`${this.baseUrl}api/usuario/create`, data ,this.headers)
        .pipe(
            tap(
                (res: any) => {
                    // console.log('Esta es la respuesta por crear un UsuarioNuevo: ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
    }

    consultarUsuarioPorId(idUsuario: string){
        return this.http.get(`${this.baseUrl}api/usuario/get/${idUsuario}`,this.headers)
        .pipe(
            tap(
                (res: any) => {
                    // console.log('res');
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
    }

    consultarUsuarioPorIdMergeMap(arrayIdsCanciones: string[]){
        return from(arrayIdsCanciones).pipe(
            mergeMap((id) => <Observable<any>> this.http.get(`${this.baseUrl}api/usuario/get/mergeMap/${id}`, this.headers) ),
            map( (res: any) => res.data)
        );
    }

    consultarUsuarioPorEmail(correoUsuario: string){

        return this.http.get(`${this.baseUrl}api/usuario/get/porEmail/${correoUsuario}`,this.headers)
        .pipe(
            tap(
                (res: any) => {
                    // console.log('res PorEmail: ', res);
                }
            ),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
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
        );
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

    guardarImagen(imagen: File, idAdministrador:string){

        let formData = new FormData;
        formData.append('imagen', imagen);

        return this.http.put(`${this.baseUrl}api/usuario/updateImagen/${idAdministrador}`, formData, this.headers)
        .pipe(
            tap( (resp: any) => {
                const dataFormateadoUsuario: UsuarioInterface = this.formatoParaUsuario(resp.data);
                this.asignarDatos(dataFormateadoUsuario);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    eliminarImagen(){

        return this.http.delete(`${this.baseUrl}api/usuario/deleteImagen/${this.usuario.id}`, this.headers)
        .pipe( 
            tap( (res: any) => {
                const dataFormateadoUsuario: UsuarioInterface = this.formatoParaUsuario(res.data);
                this.asignarDatos(dataFormateadoUsuario);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    actualizarUsuario(data: Object, idUsuario: string){
        return this.http.put(`${this.baseUrl}api/usuario/update/${idUsuario}`, data, this.headers)
        .pipe(
            map( (res: any) => {
                console.log('Res', res);
                const dataFormateadoUsuario: UsuarioInterface = this.formatoParaUsuario(res.data);
                this.asignarDatos(dataFormateadoUsuario);
                return res
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        )
    }

    actualizarUsuarioPassword(value: object, idUsuario: string){

        return  this.http.put(`${this.baseUrl}api/usuario/updatePassword/${idUsuario}`, value, this.headers)
        .pipe(
            tap( (res) => {
                // console.log('Respuesta del servicio updatePassword: ', res);
            }),
            catchError( (error) => {
                return of ({ok: false, message: error})
            })
        );
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

    formatoParaUsuario(data: any): UsuarioInterface{

        const userDataFormateado: UsuarioInterface = {
            id: data._id, 
            apellidos: data.apellidos, 
            bloqueado: data.bloqueado, 
            confirmarCorreo: data.confirmarCorreo, 
            email: data.email, 
            imagenID: data.imagenID,
            imagenURL: data.imagenURL,
            nombre: data.nombre, 
            password: data.password, 
            role: data.role, 
            google: data.google 
        };
        return userDataFormateado as UsuarioInterface;

    }

    asignarDatos(data: UsuarioInterface){
        this.usuario = {...data};
        this.menuService.setRole = "USUARIO";
    }


}
