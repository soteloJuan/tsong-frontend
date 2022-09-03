import {Injectable} from '@angular/core';


// 
import Swal from 'sweetalert2';

@Injectable({
    providedIn:'root'
})

export class AlertasServices{

    alertaExito(texto: string){
        Swal.fire({
            position: 'center',
            icon: 'success',
            showConfirmButton: false,
            title: `¡ ${texto} !`,
            timer: 1000
        });
    }

    alertaError(){
        Swal.fire({
            position: 'center',
            icon: 'warning',
            showConfirmButton: false,
            title: '¡ ERROR !',
            timer: 1500
        });
    }
    alertaErrorMs(error: any){
        Swal.fire({
            position: 'center',
            icon: 'warning',
            showConfirmButton: false,
            title: `¡ ${error} !`,
            timer: 1500
        });
    }

    alertaEliminar(texto: string): any{
        return Swal.fire({
            title: '¿ Estas Seguro ?',
            text: ` ¡ ${texto} !`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡ Si,  Borrar !'
        });
    }

    alertaPreguta(header: string, body: string, textConfirm: string){

        const i = "info";
        return Swal.fire({
            title: `${header} ?`,
            text: `${body} !`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `${textConfirm}`
        });
    }


    alertaAdvertercia(texto: string){
        Swal.fire({
            position: 'center',
            icon: 'warning',
            showConfirmButton: false,
            title: `¡ ${texto} !`,
            timer: 1500
        });
    }

}

