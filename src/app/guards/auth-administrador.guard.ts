import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';

// Servicios
import { AuthAdministradorService } from '../authAdministrador/services/authAdministrador.service';

// route
import {Router} from '@angular/router';

// rxjs
import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthAdministradorGuard implements CanActivate, CanLoad {

  constructor(private authAdmin: AuthAdministradorService, private router: Router){}
  canLoad(): boolean | Observable<boolean>  {
    return this.authAdmin.validarToken().pipe(
      tap(
        (res: boolean) => {
          if(!res){
            this.router.navigateByUrl('authAdministrador');
          }
        }
      )
    );
  }

  canActivate(): Observable<boolean> | boolean {
    return this.authAdmin.validarToken().pipe(
      tap(
        (res: boolean) => {
          if(!res){
            this.router.navigateByUrl('authAdministrador');
          }
        }
      )
    );
  }

}
