
//  Modules
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

// Components
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { SpinnerComponent } from './pages/spinner/spinner.component';
import { Spinner2Component } from './pages/spinner2/spinner2.component';
import { ReproductorComponent } from './pages/reproductor/reproductor.component';


// pipes
import { ConvertirTotalTiempoPipe } from './pipes/convertir-total-tiempo.pipe';


@NgModule({
    declarations: [
        SidebarComponent,
        SpinnerComponent,
        Spinner2Component,
        ReproductorComponent,
        ConvertirTotalTiempoPipe
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    providers: [
    ],
    exports: [
        SidebarComponent,
        SpinnerComponent,
        Spinner2Component,
        ReproductorComponent
    ]

})



export class SharedModule{}
