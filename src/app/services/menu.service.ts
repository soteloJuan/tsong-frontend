import {Injectable} from '@angular/core';
@Injectable({
    providedIn: 'root'
})


export class MenuService{
    public menu!: any[];
    private role!: string;
    
    updateMenu(){
        this.menu = JSON.parse(localStorage.getItem('menu')!) || [];
    }

    set setRole(role: string){
        this.role = role;
    }

    get getRole(){
        return this.role;
    }


    menuAdminPro(){

        return JSON.stringify([
            {titulo: 'Welcome', url: '/administrador/welcome', icon: 'far fa-hand-scissors nav__icon'},
            {titulo: 'Peril', url: '/administrador/perfil', icon: 'fa fa-user-circle nav__icon'},
            {titulo: 'Administrador', url: '/administrador/crear', icon: 'fas fa-users nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/administrador/crear'},
                {titulo: 'Ver Todos', url: '/administrador/verTodos'},
            ]},
            {titulo: 'Usuarios', url: '/administrador/verTodosUsuarios', icon: 'fas fa-user-friends nav__icon'},
            {titulo: 'Artista', icon: 'fas fa-microphone-alt nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/administrador/artista/crear'},
                {titulo: 'Ver Todos', url: '/administrador/artista/verTodos'},
            ]},
            {titulo: 'Album', icon: 'fas fa-compact-disc nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/administrador/album/crear'},
                {titulo: 'Ver Todos', url: '/administrador/album/verTodos'},
            ]},
            {titulo: 'Cancion', icon: 'fas fa-music nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/administrador/cancion/crear'},
                {titulo: 'Ver Todos', url: '/administrador/cancion/verTodos'},
            ]},
            {titulo: 'Lista',  url: '/administrador/lista/verTodosGeneral', icon: 'fas fa-clipboard-list nav__icon'},

        ]);
    }

    menuAdmin(){

        return JSON.stringify([
            {titulo: 'Welcome', url: '/administrador/welcome', icon: 'far fa-hand-scissors nav__icon'},
            {titulo: 'Peril', url: '/administrador/perfil', icon: 'fa fa-user-circle nav__icon'},
            {titulo: 'Usuarios', url: '/administrador/verTodosUsuarios', icon: 'fas fa-user-friends nav__icon'},
            {titulo: 'Artista', icon: 'fas fa-microphone-alt nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/administrador/artista/crear'},
                {titulo: 'Ver Todos', url: '/administrador/artista/verTodos'},
            ]},
            {titulo: 'Album', icon: 'fas fa-compact-disc nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/administrador/album/crear'},
                {titulo: 'Ver Todos', url: '/administrador/album/verTodos'},
            ]},
            {titulo: 'Cancion', icon: 'fas fa-music nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/administrador/cancion/crear'},
                {titulo: 'Ver Todos', url: '/administrador/cancion/verTodos'},
            ]},
            {titulo: 'Lista',  url: '/administrador/lista/verTodosGeneral', icon: 'fas fa-clipboard-list nav__icon'},
        ]);
    }

    menuUser(){

        return JSON.stringify([
            {titulo: 'Welcome', url: '/usuario/welcome', icon: 'far fa-hand-scissors nav__icon'},
            {titulo: 'Perfil', url: '/usuario/perfil', icon: 'fa fa-user-circle nav__icon'},
            {titulo: 'Artista', url: '/usuario/artista/verTodos', icon: 'fas fa-microphone-alt nav__icon'},
            {titulo: 'Album',url: '/usuario/album/verTodos', icon: 'fas fa-compact-disc nav__icon'},
            {titulo: 'Cancion', url: '/usuario/cancion/verTodos', icon: 'fas fa-music nav__icon'},
            {titulo: 'Lista', icon: 'fas fa-clipboard-list nav__icon',
            submenu: [
                {titulo: 'Crear', url: '/usuario/lista/crear'},
                {titulo: 'Propios', url: '/usuario/lista/verListasPropios'},
                {titulo: 'Compartidos', url: '/usuario/lista/verListasCompartidos'},
            ]},
        ]);
    }

}