
// Module.
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';

// Componentes.
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MainComponent } from './pages/main/main.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { BuzonComponent } from './pages/buzon/buzon.component';
import { CrearComponent } from './pages/crear/crear.component';
import { VerTodosComponent } from './pages/ver-todos/ver-todos.component';
import { VerTodosUsuariosComponent } from './pages/ver-todos-usuarios/ver-todos-usuarios.component';
import { VerUnUsuarioComponent } from './pages/ver-un-usuario/ver-un-usuario.component';

@NgModule({
    declarations:
    [
      PerfilComponent,
      MainComponent,
      WelcomeComponent,
      BuzonComponent,
      CrearComponent,
      VerTodosComponent,
      VerTodosUsuariosComponent,
      VerUnUsuarioComponent
    ],
    imports:
    [
        CommonModule,
        AdministradorRoutingModule,
        SharedModule,
        PipesModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports:
    [
      AdministradorRoutingModule,
    ]
})


export class AdministradorModule{ }










