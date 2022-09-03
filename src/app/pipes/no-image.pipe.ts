import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noImage'
})
export class NoImagePipe implements PipeTransform {

  transform(value: string): string{

    const newValue  = './assets/images/no-image.png';

    if(!!value == false || value == null || value == 'null'){
      return newValue;
    }

    
    return value;
  }

}
