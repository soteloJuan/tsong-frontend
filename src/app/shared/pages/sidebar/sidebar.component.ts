import { Component, Renderer2 } from '@angular/core';

// Services
import { LogoutService } from '../../../services/logout.service';
import { MenuService } from '../../../services/menu.service';
import { AlertasServices } from '../../../services/alertas.service';
import { ReproductorService } from '../../../services/reproductor.service';
import { UltimaCancionService } from '../../../services/ultimaCancion.service';
import { UsuarioService } from '../../../usuario/services/usuario.service';
// import from ''

// Routes
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {

  bandera = false;

  constructor(
    private render2: Renderer2,
    private router: Router,
    private logoutService: LogoutService,
    public menuService: MenuService,
    private alertaService: AlertasServices,
    private reproductorService: ReproductorService,
    private ultimaCancionService: UltimaCancionService,
    private usuarioService: UsuarioService
    ) {
      this.menuService.updateMenu();
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
        const idUltimaCancion = this.reproductorService.idUltimaCancion;
        const idCancion = this.reproductorService.cancion.id;
        const idUsuario = this.usuarioService.usuario.id;
        this.ultimaCancionService.updateUltimaCancion(idUltimaCancion,idCancion, idUsuario)
        .subscribe({
          next: (res) => {
            this.reproductorService.pause();
            this.alertaService.alertaExito(alertTextExito);
            this.logoutService.logout();
            this.router.navigateByUrl('/');
          }
        });
      }  
    });
  }

  reproductorBandera(evento: any){
    (evento === "Play") 
      ?(this.reproductorService.setActivo = true) 
      :(this.reproductorService.setActivo = false);
  }

}
