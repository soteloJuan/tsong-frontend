// Modulos

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


// Components.

import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
    {
        path:'', component: MainComponent, 
        children:
        [
            {
                path:'', component: LoginComponent
            },        {
                path:'forgotPassword', component: ForgotPasswordComponent
            },
            {
                path:'**', redirectTo: '404'
            }
        ]
    }
]

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})

export class AuthAdministradorRoutingModule{}
