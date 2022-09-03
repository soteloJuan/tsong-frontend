import {Injectable} from '@angular/core';


@Injectable({
    providedIn: 'root'
})

export class SpinnerService{

    private isLoading = false;

    get getValueSpinner(){
        return this.isLoading;
    }

    set setSpinner(value: boolean){
        this.isLoading = value;
    }

}
