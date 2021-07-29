//  Modules

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AuthAdministradorModule } from './authAdministrador/authAdministrador.module';
import { SharedModule } from './shared/shared.module';

// Components

import { AppComponent } from './app.component';
import { HomeComponent } from './inicio/home/home.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

// routes


// Interceptor


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NopagefoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthAdministradorModule,
    SharedModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


// Musica parqa trabajar un rato https://www.youtube.com/watch?v=E1foE6xq66k&list=RDGMEM6ijAnFTG9nX1G-kbWBUCJA&index=8

// Musica para trabajar un rato: https://www.youtube.com/watch?v=OPAy-sQQ7xU
