import { Injectable } from '@angular/core';
import {  CanActivate, UrlTree, CanLoad, Route, UrlSegment } from '@angular/router';
import {Router} from '@angular/router';


// Servicios
import { AuthUsuarioService } from '../authUsuario/services/authUsuario.service';


// rxjs
import {tap} from 'rxjs/operators';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthUsuarioGuard implements CanActivate, CanLoad{

  constructor(
    private authUsuarioService: AuthUsuarioService,
    private router: Router){

  }

  canLoad(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authUsuarioService.validarToken().pipe(
      tap(
        (res: boolean) => {
          if(!res){
            this.router.navigateByUrl('authUsuario');
          }
        }
      )
    );
  }


  canActivate(): Observable<boolean>{
    return this.authUsuarioService.validarToken().pipe(
      tap(
        (res: boolean) => {
          if(!res){
            this.router.navigateByUrl('authUsuario');
          }
        }
      )
    );
  }
  
}
