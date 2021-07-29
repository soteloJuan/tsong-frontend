// Modulos

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Routings


// Components
import {HomeComponent} from '../app/inicio/home/home.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

// Guards
import { AuthAdministradorGuard } from './guards/auth-administrador.guard';

const routes: Routes = [
    {
        path:'', component: HomeComponent
    },
    {
        path:'authAdministrador',
        loadChildren: () => import('./authAdministrador/authAdministrador.module').then( m => m.AuthAdministradorModule)
    },
    {
        path:'authUsuario',
        loadChildren: () => import('./authUsuario/authUsuario.module').then( m => m.AuthUsuarioModule)
    },
    {
        path:'administrador',
        canActivate: [AuthAdministradorGuard],
        canLoad: [AuthAdministradorGuard],
        loadChildren: () => import('./administrador/administrador.module').then( m => m.AdministradorModule),
    },{
        path:'usuario',
        canActivate: [],
        canLoad: [],
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)

    },
    {
        path:'404', component: NopagefoundComponent
    },
    {
        path:'**', redirectTo: '404'
    }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]

})
export class AppRoutingModule{}



