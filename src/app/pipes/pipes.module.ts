import {NgModule} from '@angular/core';


// Pipes
import { ButtonTextImgPipe } from './button-text-img.pipe';
import { NoImagePipe } from './no-image.pipe';


@NgModule({
    declarations: [
        ButtonTextImgPipe,
        NoImagePipe
    ],
    imports: [],
    exports: [
        ButtonTextImgPipe,
        NoImagePipe
    ]
})


export class PipesModule{}


