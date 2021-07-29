import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buttonTextImg'
})
export class ButtonTextImgPipe implements PipeTransform {

  transform(value: string): string {
    if(!!value == false)
      return 'AGREGAR FOTO';


    return 'CAMBIAR FOTO'; 
  }

}
