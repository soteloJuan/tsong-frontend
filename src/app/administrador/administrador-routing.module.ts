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
import {VerUnUsuarioComponent} from './pages/ver-un-usuario/ver-un-usuario.component';
import { VerTodosUsuariosComponent } from './pages/ver-todos-usuarios/ver-todos-usuarios.component';


const routes: Routes = [
    {
        path:'', component: MainComponent, children:
        [
            {
                path:'', component: WelcomeComponent
            },
            {
                path:'welcome', component: WelcomeComponent
            },
            {
                path:'perfil', component: PerfilComponent
            },
            {
                path:'buzon', component: BuzonComponent
            },
            { // Este solo un administrador con Role: ADMIN_PRO puede acceder
                path:'crear', component: CrearComponent
            },
            { // Este solo un administrador con Role: ADMIN_PRO puede acceder
                path:'verTodos', component: VerTodosComponent
            },
            {
                path:'verTodosUsuarios', component: VerTodosUsuariosComponent
            },
            {
                path:'verUnUsuario/:idUsuario', component: VerUnUsuarioComponent
            },
            {
                path:'artista',
                loadChildren: () => import('../artista/artista.module').then( m => m.ArtistaModule)
            },
            {
                path:'album',
                loadChildren: () => import('../album/album.module').then( m => m.AlbumModule)
            },
            {
                path: 'cancion',
                loadChildren: () => import('../cancion/cancion.module').then( m => m.CancionModule)
            },
            {
                path: 'lista',
                loadChildren: () => import('../lista/lista.module').then(m => m.ListaModule)
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

