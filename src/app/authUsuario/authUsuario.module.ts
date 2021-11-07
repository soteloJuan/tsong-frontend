// Modulos

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {AuthUsuarioRoutingModule} from './authUsuario-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';


@NgModule({
    declarations: [
        LoginComponent,
        RegistroComponent
    ],
    imports: [
        CommonModule,
        AuthUsuarioRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: []
})


export class AuthUsuarioModule{}



