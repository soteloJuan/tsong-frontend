import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AlbumRoutingModule } from './album.rounting.module';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';

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
        AlbumRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        PipesModule
    ],
    exports: [
        CrearComponent,
        VerTodosComponent,
        VerUnoComponent
    ]
})




export class AlbumModule{}
