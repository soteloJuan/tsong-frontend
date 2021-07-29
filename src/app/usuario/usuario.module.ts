// Modules

import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { UsuarioRoutingModule } from './usuario-routing.module';


// Componets

@NgModule({
    declarations: [
],
    imports: [
        UsuarioRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        UsuarioRoutingModule
    ]
})



export class UsuarioModule{

}


