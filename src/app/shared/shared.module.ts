//  Modules

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import { SpinnerComponent } from './pages/spinner/spinner.component';
import { Spinner2Component } from './pages/spinner2/spinner2.component';

// Components


@NgModule({
    declarations: [
        SidebarComponent,
        SpinnerComponent,
        Spinner2Component
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
        Spinner2Component
    ]

})



export class SharedModule{}
