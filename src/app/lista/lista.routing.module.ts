import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Componentes
import { CrearComponent } from './pages/crear/crear.component';
import { VerListasPropiosComponent } from './pages/ver-listas-propios/ver-listas-propios.component';
import { VerTodosGeneralComponent } from './pages/ver-todos-general/ver-todos-general.component';
import { VerUnoComponent } from './pages/ver-uno/ver-uno.component';
import { VerListasCompartidosComponent } from './pages/ver-listas-compartidos/ver-listas-compartidos.component';
import { VerUnoCompartidosComponent } from './pages/ver-uno-compartidos/ver-uno-compartidos.component';

const routes: Routes = [
    {
        path: 'crear', component: CrearComponent
    },
    {
        path: 'verListasPropios', component: VerListasPropiosComponent
    },
    {
        path: 'verTodosGeneral', component: VerTodosGeneralComponent
    },
    {
        path: 'verListasCompartidos', component: VerListasCompartidosComponent
    },
    {
        path: 'verUno/:idListaReproduccion', component: VerUnoComponent
    },
    {
        path: 'verUnoCompartidos/:idListaReproduccion', component: VerUnoCompartidosComponent
    }
];


@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ListaRoutingModule{}









