import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { ListaRoutingModule } from './lista.routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';


// Components
import { CrearComponent } from './pages/crear/crear.component';
import { VerListasPropiosComponent } from './pages/ver-listas-propios/ver-listas-propios.component';
import { VerTodosGeneralComponent } from './pages/ver-todos-general/ver-todos-general.component';
import { VerListasCompartidosComponent } from './pages/ver-listas-compartidos/ver-listas-compartidos.component';
import { VerUnoComponent } from './pages/ver-uno/ver-uno.component';
import { VerUnoCompartidosComponent } from './pages/ver-uno-compartidos/ver-uno-compartidos.component';

@NgModule({
    declarations: [
        CrearComponent,
        VerListasPropiosComponent,
        VerTodosGeneralComponent,
        VerListasCompartidosComponent,
        VerUnoComponent,
        VerUnoCompartidosComponent
    ],
    imports: [
        CommonModule,
        ListaRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        SharedModule
    ],
    exports: [
        CrearComponent,
        VerListasPropiosComponent,
        VerTodosGeneralComponent,
        VerListasCompartidosComponent,
        VerUnoComponent,
        VerUnoCompartidosComponent
    ]
})




export class ListaModule{}





