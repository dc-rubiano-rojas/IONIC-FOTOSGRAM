import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RespuestaPosts, Post } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  paginPosts = 0;

  nuevoPost = new EventEmitter<Post>();

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService,
              private fileTransfer: FileTransfer) { }

  getPosts(pull: boolean = false) {

    if (pull) {
      this.paginPosts = 0;
    }

    this.paginPosts++;

    return this.http.get<RespuestaPosts>(`${URL}/posts/?pagina=${this.paginPosts}`);
  }


  crearPost( post ) {

    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token
    });

    // console.log(post);
    return new Promise(resolve => {

      this.http.post(`${URL}/posts`, post, {headers})
                .subscribe(res => {

                  this.nuevoPost.emit(res['post']);
                  resolve(true);
                });

    });
  }


  subirImagen(img: string) {

    const options: FileUploadOptions = {
      // En el filekey va el nombre que le pusimos como lo va a recibir
      // el backend
      fileKey: 'image',
      headers: {
        'x-token': this.usuarioService.token
      }
    };

    // este es un mecanismo para saber que porcentaje de la img se ha subido
    // o cuanto lleva o si ya se subio
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer.upload(img, `${URL}/posts/upload`, options)
    .then((data) => {
      // success
      console.log(data);
    }, (err) => {
      // error
      console.log('error en carga', err);
    });
  }




}
