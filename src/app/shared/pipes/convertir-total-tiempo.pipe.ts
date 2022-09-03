import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertirTotalTiempo'
})
export class ConvertirTotalTiempoPipe implements PipeTransform {

  transform(value: any) {

    let minutos= 0;
    let segundos = 0;

    minutos = Math.floor(value / 60);

    const temporal = ((value / 60).toFixed(2)).toString();
    const valores: any = temporal.split('.');
    segundos = valores[1];

    return `${minutos} : ${segundos}`;
  }

}
