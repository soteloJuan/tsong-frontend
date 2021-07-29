// Modulos 

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AuthAdministradorRoutingModule } from './authAdministrador-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpClientModule} from '@angular/common/http'

// Components
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { MainComponent } from './pages/main/main.component';

@NgModule({
    declarations: [
        LoginComponent,
        ForgotPasswordComponent,
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
        LoginComponent,
        AuthAdministradorRoutingModule
    ]
})

export class AuthAdministradorModule{}
