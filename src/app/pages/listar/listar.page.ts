import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Route, Router } from '@angular/router';
import { ServicebdService } from 'src/app/services/servicebd.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.page.html',
  styleUrls: ['./listar.page.scss'],
})
export class ListarPage implements OnInit {

  arregloNoticias: any = [{
    id: '',
    titulo: '',
    texto: ''
  }];


  constructor(private bd: ServicebdService, private router: Router) { }

  ngOnInit() {
    //verificar si la base de datos esta lita
    this.bd.dbState().subscribe(res=>{
      if(res){
        this.bd.fetchNoticias().subscribe(data=>{
          this.arregloNoticias = data;
        })
      }
    })

  }

  modificar(x:any){
    let navigationExtras : NavigationExtras = {
      state : {
        noticia : x
      }
    }
    this.router.navigate(['/modificar'],navigationExtras)

  }

  eliminar(x:any){
    this.bd.eliminarNoticia(x.idnoticia);


  }

  irPagina(){
    this.router.navigate(['/agregar'])
  }

}
