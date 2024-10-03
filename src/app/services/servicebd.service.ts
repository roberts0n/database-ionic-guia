import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable, } from 'rxjs';
import { Noticias } from './noticias';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServicebdService {

  //variable de conexión a la Base de Datos
  public database!: SQLiteObject;

  //variables de creación de tablas
  tablaNoticia: string = "CREATE TABLE IF NOT EXISTS noticia(idnoticia INTEGER PRIMARY KEY autoincrement, titulo VARCHAR(100) NOT NULL, texto TEXT NOT NULL);";


  //variables de insert por defecto
  registroNoticia: string = "INSERT OR IGNORE INTO noticia (idnoticia, titulo, texto) values(1,'Soy un titulo de la noticia,'Soy el contenido completo de toda la primera noticia insertada en la BD')";


  //variables tipo observables para manipular los registros de la base de datos
  listaNoticias = new BehaviorSubject([])

  //variable observable para el estatus de la base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(private sqlite: SQLite, private platform: Platform,private alertController: AlertController) {
    this.crearBD()
   }

  crearBD(){
    //verificar si la plataforma está lista
    this.platform.ready().then(()=>{
      //crear la base de datos
      this.sqlite.create({
        name: 'bdnoticias.db',
        location: 'default'
      }).then((bd: SQLiteObject)=>{
        //guardar la conexion a la base de datos
        this.database = bd;

        //llamar la creacion de las tablas
        this.crearTablas();
        this.getNoticias();

        //modificar el estado de la base de datos
        this.isDBReady.next(true);
      }).catch(e=>{
        this.presentAlert('crearDB','Error: ' + JSON.stringify(e));
      })
    })
  }

  crearTablas(){
    try{
      //ejecuto la creacion de tablas en orden
      this.database.executeSql(this.tablaNoticia,[]);

      //ejecuto los insert en caso de que existan

      this.database.executeSql(this.registroNoticia,[]);
      

    }catch(e){
      this.presentAlert('CrearTabla','Error :' + JSON.stringify(e))
    }

  }

  async presentAlert(titulo: string,mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Action'],
    });

    await alert.present();
  }

  fetchNoticias(): Observable<Noticias[]>{
    return this.listaNoticias.asObservable();
  }

  dbState(){
    return this.isDBReady.asObservable();
  }

  getNoticias(){
   return this.database.executeSql('SELECT * from noticia',[]).then(res=>{
    //variable para almacenar el resultado del select
    let items: Noticias[] = [];
    //verificar si el select trae mas de 1 registro
    if(res.rows.length > 0){
      for(var i = 0; i > res.rows.length; i++){
        //ingresar registro a registro en mi variable 
        items.push({
          idnoticia : res.rows.item(i).idnoticia,
          titulo : res.rows.item(i).titulo,
          texto : res.rows.item(i).texto,
        })

      }

    }

    this.listaNoticias.next(items as any);
   }) 
  };

  insertarNoticia(titulo:string, texto:string){
    return this.database.executeSql('INSERT INTO noticia(titulo,texto) VALUES(?, ?,) ',[titulo, texto]).then((res)=>{
      this.presentAlert('Agregar','Noticia agregada correctamente')
      this.getNoticias();

    }).catch(e=>{
      this.presentAlert('Agregar','Error :  ' + JSON.stringify(e))
    })
  }

  modificarNoticia(id:string,titulo:string,texto:string){
    return this.database.executeSql('UPDATE noticias SET titulo = ?, texto = ?, WHERE idnoticia = ?',[titulo,texto,id]).then((res)=>{
      this.presentAlert('Modificar','Noticia modificada correctamente')
      this.getNoticias();

    }).catch(e=>{
      this.presentAlert('Agregar','Error :  ' + JSON.stringify(e))
    })
  };

  eliminarNoticia(id:string){
    return this.database.executeSql('DELETE FROM noticia WHERE idnoticia = ?',[id]).then((res)=>{
      this.presentAlert('Eliminar','Noticia eliminada correctamente')
      this.getNoticias();

    }).catch(e=>{
      this.presentAlert('Agregar','Error :  ' + JSON.stringify(e))
    })
  }

}
