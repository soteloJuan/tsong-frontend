// Modulos

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


// Components.

import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
    {
        path:'', component: MainComponent, 
        children:
        [
            {
                path:'', component: LoginComponent
            },        
            {
                path:'**', redirectTo: '404'
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]

})

export class AuthAdministradorRoutingModule{}
