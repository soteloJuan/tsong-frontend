import { Component, OnInit } from '@angular/core';


// Servvicio
import { UsuarioService } from '../../services/usuario.service';

// Navigate
import {Router} from '@angular/router';




@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router, public usuarioService: UsuarioService) { 
  }

  ngOnInit(): void {
  }

  
  irBuzon(){
    this.router.navigateByUrl('usuario/buzon');

  }

}
