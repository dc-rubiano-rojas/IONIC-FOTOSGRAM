import { NgModule } from '@angular/core';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [
    DomSanitizerPipe,
    ImagenPipe
  ],
  exports: [
    DomSanitizerPipe,
    ImagenPipe
  ]
})
export class PipesModule { }
