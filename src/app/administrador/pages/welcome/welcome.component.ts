import { Component, OnInit } from '@angular/core';



// Services
import { AdministradorService } from '../../services/administrador.service';

// Navigate
import {Router} from '@angular/router';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private router: Router, public administradorService: AdministradorService) { }

  ngOnInit(): void {
  }

  irBuzon(){
    this.router.navigateByUrl('administrador/buzon');
  }

}
