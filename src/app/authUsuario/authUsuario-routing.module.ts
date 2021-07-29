// Modules

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Components
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';

const routes: Routes = [
    {
        path:'',children:
        [
            {
                path:'', component: LoginComponent
            },
            {
                path:'registro', component: RegistroComponent
            },
            {
                path:'**', redirectTo:'404'
            }
        ]
    }
];


@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})



export class AuthUsuarioRoutingModule{}



