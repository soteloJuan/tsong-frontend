import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// Service
import { AlertasServices } from '../../../services/alertas.service';
@Component({
  selector: 'app-buzon',
  templateUrl: './buzon.component.html',
  styleUrls: ['./buzon.component.css']
})
export class BuzonComponent{

  @ViewChild('laSugerencia') sugerencia!: ElementRef;

  constructor(private alertaService: AlertasServices) { }

  enviar(){
    const alertHeader = 'Quiere enviar su sugerencia',
          alertBody = 'Ya no podra elimnarlo despues',
          alertButtonConfirm = 'Si',
          alertTextAdvertencia = '¡ Escriba su sugerencia !',
          alertTextExito = '¡ Su sugerencia ha sido enviado !';


    const valueSugerencia: string = this.sugerencia.nativeElement.value.trim();

    if(!valueSugerencia){
      this.alertaService.alertaPreguta(alertHeader, alertBody, alertButtonConfirm)
      .then((result) => {
        // result.isConfirmed == true && this.alertaService.alertaExito(alertTextExito); // Esto es short conditional
        if(result.isConfirmed){
          this.alertaService.alertaExito(alertTextExito);
          this.sugerencia.nativeElement.value = "";
        }
      });
    }else{
      this.alertaService.alertaAdvertercia(alertTextAdvertencia);
    }

  }
}
