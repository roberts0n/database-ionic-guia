import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {

  noticiaM : any;

  constructor(private router : Router, private activeRouter: ActivatedRoute,private bd : ServicebdService) {
    this.activeRouter.queryParams.subscribe(res=>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.noticiaM = this.router.getCurrentNavigation()?.extras?.state?.['noticia'];
      }
    })
   }

  ngOnInit() {
  }

  modificar(){
    this.bd.modificarNoticia(this.noticiaM.idnoticia,this.noticiaM.titulo,this.noticiaM.texto);

  }

}
