import { NgModule } from "@angular/core";
import {RouterModule, Routes} from '@angular/router';

// components
import { CrearComponent } from './pages/crear/crear.component';
import { VerTodosComponent } from './pages/ver-todos/ver-todos.component';
import { VerUnoComponent } from './pages/ver-uno/ver-uno.component';

// guards
import { AuthAdministradorGuard } from '../guards/auth-administrador.guard';

const routes: Routes = [
    {
        canActivate: [AuthAdministradorGuard],
        path:'crear', component: CrearComponent
    },
    {
        path:'verTodos', component: VerTodosComponent
    },
    {
        path:'verUno/:idArtista', component: VerUnoComponent
    },
    {
        path:'**', redirectTo:'404'
    }
]


@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ArtistaRoutingModule{}



