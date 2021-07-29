import {Injectable} from '@angular/core';

// Form
import {FormGroup} from '@angular/forms';


@Injectable({
    providedIn: 'root'
})


export class CampoValidoService{

    public miFormulario!: FormGroup;

    esValidoCampo(campo: string): Boolean{
        return this.miFormulario.controls[campo].errors!
                && this.miFormulario.controls[campo].touched;
    }

}