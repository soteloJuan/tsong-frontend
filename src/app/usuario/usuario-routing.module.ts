import { NgModule, Component } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


// Modulos

// Components
import { MainComponent } from './pages/main/main.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { BuzonComponent } from './pages/buzon/buzon.component';


const routes: Routes = [
    {
        path: '', component: MainComponent, children:[
            {
                path:'', component: WelcomeComponent
            },
            {
                path:'welcome', component: WelcomeComponent
            },
            {
                path:'buzon', component: BuzonComponent
            },
            {
                path:'perfil', component: PerfilComponent
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
];


@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class UsuarioRoutingModule{}




