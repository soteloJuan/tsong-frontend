import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})


export  class LogoutService{

    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('menu');    
    }
}

