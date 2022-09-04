// Modulos 

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AuthAdministradorRoutingModule } from './authAdministrador-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpClientModule} from '@angular/common/http'

// Components
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';

@NgModule({
    declarations: [
        LoginComponent,
        MainComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AuthAdministradorRoutingModule
    ],
    exports: [
    ]
})

export class AuthAdministradorModule{}
