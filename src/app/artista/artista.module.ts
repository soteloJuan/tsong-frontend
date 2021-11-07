import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { ArtistaRoutingModule } from './artista.routing.module';
import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';



// Components
import { CrearComponent } from './pages/crear/crear.component';
import { VerTodosComponent } from './pages/ver-todos/ver-todos.component';
import { VerUnoComponent } from './pages/ver-uno/ver-uno.component';

@NgModule({
    declarations: [
        CrearComponent,
        VerTodosComponent,
        VerUnoComponent
    ],
    imports: [
        ArtistaRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        PipesModule,
        SharedModule
    ],
    exports: [
        CrearComponent,
        VerTodosComponent,
        VerUnoComponent
    ]
})


export class ArtistaModule{}