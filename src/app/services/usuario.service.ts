import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  private usuario: Usuario = {};

  constructor(private http: HttpClient,
              private storage: Storage,
              private navCtrl: NavController) { }


  login(email: string, password: string) {
    const data = { email, password };

    return new Promise( resolve => {

      this.http.post(`${URL}/user/login`, data)
                .subscribe( async res => {
                  console.log(res);

                  if (res['ok']) {
                    await this.guardarToken( res['token'] );
                    resolve(true);
                  } else {
                    this.token = null;
                    this.storage.clear();
                    resolve(false);
                  }
                });
    });
  }


  logOut() {
    this.token   = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', {animated: true});
  }



  registro(usuario: Usuario) {

    return new Promise (resolve => {

      this.http.post(`${URL}/user/create`, usuario)
              .subscribe(async res => {
                console.log(res);

                if (res['ok']) {
                  await this.guardarToken( res['token'] );
                  resolve(true);
                } else {
                  this.token = null;
                  this.storage.clear();
                  resolve(false);
                }
              });
    });
  }

  getUsuario() {

    // Aca ya habra pasado por el guard por lo cual ya se abra llamado el validaToken()
    // entonces ya tendremos la info del usuario

    if (!this.usuario._id) {
      this.validaToken();
    }

    return {...this.usuario};
  }



  async guardarToken(token: string) {

    this.token = token;
    await this.storage.set('token', token);

    await this.validaToken();
  }


  async cargarToken() {

    this.token = await this.storage.get('token') || null;
  }



  async validaToken(): Promise<boolean> {

    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {

      const headers = new HttpHeaders({
        'x-token': this.token
      });

      this.http.get(`${URL}/user/`, {headers})
              .subscribe( res => {

                if (res['ok']) {
                  this.usuario = res['usuario'];
                  resolve(true);
                } else {
                  this.navCtrl.navigateRoot('/login');
                  resolve(false);
                }

              });


    });
  }



  actualizarUsuario(usuario: Usuario) {

    const headers = new HttpHeaders({
      'x-token': this.token
    });

    return new Promise(resolve => {

          this.http.post(`${URL}/user/update`, usuario, {headers} )
                    .subscribe( res => {

                      if (res['ok']) {
                        this.guardarToken(res['token']);
                        resolve(true);
                      } else {
                        resolve(false);
                      }

                    });
    });
  }



}
