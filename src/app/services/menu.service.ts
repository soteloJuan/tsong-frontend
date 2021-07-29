import {Injectable} from '@angular/core'



@Injectable({
    providedIn: 'root'
})


export class MenuService{
    public menu!: any[];
    
    updateMenu(){
        this.menu = JSON.parse(localStorage.getItem('menu')!) || [];
    }


    menuAdminPro(){
        return JSON.stringify([
            {titulo: 'Peril', url: '/administrador/perfil', icon: 'fa fa-user-circle nav__icon'},
            {titulo: 'Administrador', url: '/administrador/crear', icon: 'fas fa-users nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/administrador/crear'},
                {titulo: 'Ver Todos', url: '/administrador/verTodos'},
            ]},
            {titulo: 'Usuarios', url: '/administrador/verTodosUsuarios', icon: 'fas fa-user-friends nav__icon'},
            {titulo: 'Artista', url: '/administrador/canciones', icon: 'fas fa-microphone-alt nav__icon',
            submenu: [
                {titulo: 'uno', url: '/#'},
                {titulo: 'dos', url: '/#'},
            ]},
            {titulo: 'Album', url: '/administrador/canciones', icon: 'fas fa-compact-disc nav__icon',
            submenu: [
                {titulo: 'uno', url: '/#'},
                {titulo: 'dos', url: '/#'},
            ]},
            {titulo: 'Cancion', url: '/administrador/canciones', icon: 'fas fa-music nav__icon',
            submenu: [
                {titulo: 'uno', url: '/#'},
                {titulo: 'dos', url: '/#'},
            ]},

            /* Nos quedamos en los subtitulos */

        ]);
    }

    menuAdmin(){
        return JSON.stringify([
            {titulo: 'Peril', url: '/administrador/perfil'},
            {titulo: 'Usuarios', url: '/administrador/usuarios'},
            {titulo: 'Artistas', url: '/administrador/artistas'},
            {titulo: 'Albums', url: '/administrador/albums'},
            {titulo: 'Canciones', url: '/administrador/canciones'},
            {titulo: 'Mis Listas', url: '//administrador/artistas'}
        ]);
    }

    menuUser(){
        return JSON.stringify([
            {titulo: 'Peril', url: '/administrador/perfil'},
            {titulo: 'Usuarios', url: '/administrador/usuarios'},
            {titulo: 'Artistas', url: '/administrador/artistas'},
            {titulo: 'Albums', url: '/administrador/albums'},
            {titulo: 'Canciones', url: '/administrador/canciones'},
            {titulo: 'Mis Listas', url: '//administrador/artistas'}
        ]);
    }

}