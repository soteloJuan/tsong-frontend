import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment } from '@angular/router';
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
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('ENTRO - canLoad');
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
    console.log('ENTRO - canActivate');
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
