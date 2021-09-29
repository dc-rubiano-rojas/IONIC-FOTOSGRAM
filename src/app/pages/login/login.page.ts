
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('slidePrincipal') slidePrincipal: IonSlides;

  registroLogin = {
    // Me bloquea que pueda mover el slide
    allowTouchMove: false,
    initialSlide: 0,
  };

  loginUser = {
    email: 'camilo@camilo.com',
    password: 'camilo'
  };

  registerUser: Usuario = {
    email: 'daniel@daniel.com',
    password: 'daniel',
    nombre: 'Daniel',
    avatar: 'av-1.png'
  }

  constructor(private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private uiService: UiServiceService) { }

  ngOnInit() {
  }

  async login(fLogin: NgForm) {

    console.log('CLICK EN EL LOGIN');

    if (fLogin.invalid) { return; }
    const valido = await this.usuarioService.login(this.loginUser.email, this.loginUser.password);

    if (valido) {
      // navegar tabs
      this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
    } else {
      // mostrar alerta de usuario y contraseña incorrecto
      this.uiService.alertaInformativa('Usuario y contraseña no son correctos.');
    }
  }

  async registro(fRegistro: NgForm) {

    if (fRegistro.invalid) {return ; }

    const valido = await this.usuarioService.registro(this.registerUser);

    if (valido) {
      // navegar tabs
      this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
    } else {
      // mostrar alerta de usuario y contraseña incorrecto
      this.uiService.alertaInformativa('Ese correo electronico ya existe');
    }
    // console.log(fRegistro.valid);
  }




}
