// Modulos
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


// Componets
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MainComponent } from './pages/main/main.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { BuzonComponent } from './pages/buzon/buzon.component';
import { CrearComponent } from './pages/crear/crear.component';
import { VerTodosComponent } from './pages/ver-todos/ver-todos.component';
import { VerTodosUsuariosComponent } from './pages/ver-todos-usuarios/ver-todos-usuarios.component';

const routes: Routes = [
    {
        path:'', component: MainComponent, children:
        [
            {
                path:'', component: WelcomeComponent
            },
            {
                path:'perfil', component: PerfilComponent
            },
            {
                path:'buzon', component: BuzonComponent
            },
            {
                path:'crear', component: CrearComponent
            },
            {
                path:'verTodos', component: VerTodosComponent
            },
            {
                path:'verTodosUsuarios', component: VerTodosUsuariosComponent
            },
            {
                path:'**', redirectTo:'404'
            }
        ]
    }
]


@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdministradorRoutingModule{}

