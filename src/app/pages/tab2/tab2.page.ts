import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  tempImages: string[] = [];

  post = {
    mensaje: '',
    coords: null,
    posicion: false
  };

  cargandoGeo = false;

  constructor(private postService: PostsService,
              private route: Router,
              private geoLocation: Geolocation,
              private camera: Camera) {}

  async crearPost() {

    console.log(this.post);
    await this.postService.crearPost(this.post);

    this.post = {
      mensaje: '',
      coords: null,
      posicion: false
    };

    this.tempImages = [];

    this.route.navigateByUrl('/main/tabs/tab1');
  }


  getGeo() {
    if (!this.post.posicion) {
      this.post.coords = null;
      return;
    }

    this.cargandoGeo = true;

    this.geoLocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.cargandoGeo = false;
      const coords = `${resp.coords.latitude}, ${resp.coords.longitude}`;
      // console.log(coords);
      this.post.coords = coords;

    }).catch((error) => {
        this.cargandoGeo = false;
        console.log('Error getting location', error);
     });
  }



  camara() {
    // correctOrientation: true, por si se toma la foto de lado que salga bien
    // sourceType: this.camera.PictureSourceType.CAMERA  Definir el origen por que
    // puede ser de la galeria o usar la cam para tomar la foto en este caso es la camara
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.procesarImage(options);
  }



  libreria() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    this.procesarImage(options);
  }




  procesarImage(options: CameraOptions) {
    this.camera.getPicture(options).then( ( imageData ) => {

      // .Ionic se encuentra cuando la app ya esta corriendo en el dispositivo
      // funciona tanto para ios como android
      const img = window.Ionic.WebView.convertFileSrc(imageData);
      console.log(img);

      this.postService.subirImagen(imageData);
      this.tempImages.push(img);

    }, (err) => {
     // Handle error
    });
  }



}
