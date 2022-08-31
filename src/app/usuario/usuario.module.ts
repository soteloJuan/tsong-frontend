// Modules

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UsuarioRoutingModule } from './usuario-routing.module';

import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';

// Components
import { MainComponent } from './pages/main/main.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { BuzonComponent } from './pages/buzon/buzon.component';

@NgModule({
    declarations: [
        MainComponent,
        WelcomeComponent,
        PerfilComponent,
        BuzonComponent
    ],
    imports: [
        UsuarioRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        PipesModule
    ],
    exports: [
        UsuarioRoutingModule
    ]
})



export class UsuarioModule{

}


