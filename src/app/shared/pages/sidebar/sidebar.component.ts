import { Component, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';


// Services
import { LogoutService } from '../../../services/logout.service';
import { MenuService } from '../../../services/menu.service';
import { AlertasServices } from '../../../services/alertas.service';

// Routes
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  bandera: boolean = false;

  constructor(private render2: Renderer2, private router: Router, private logoutService: LogoutService,
    public menuService: MenuService, private alertaService: AlertasServices) {
      this.menuService.updateMenu();
    }

  ngOnInit(): void {
  }

  clickSubmenu(valor: any){
    const ul = valor.target.nextSibling;
    const icon = valor.target;

    ul.classList.toggle('show');
    icon.classList.toggle('rotate');
  }

  logout(){

    const header = 'Estas seguro',
          body = 'Se cerrara la sesión !',
          buttonConfirm = 'Si',
          alertTextExito = 'Se cerro la sesión';

    this.alertaService.alertaPreguta(header, body, buttonConfirm).then((result) => {
      if(result.isConfirmed){
        this.alertaService.alertaExito(alertTextExito);
        this.logoutService.logout();
        this.router.navigateByUrl('/');
      }  
    });
  }



}






