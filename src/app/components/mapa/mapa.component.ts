import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit, AfterViewInit {

  @Input() coords: string;
  @ViewChild('mapa') mapa;
  // @ViewChild('mapa', {static: false}) mapa: any;

  constructor() { }

  ngOnInit() {}


  ngAfterViewInit() {
    // console.log(this.coords);

    const latLng = this.coords.split(',');
    const lat = Number(latLng[0]);
    const lng = Number(latLng[1]);

    mapboxgl.accessToken = 'pk.eyJ1IjoiZHJ1Ymlhbm8xNyIsImEiOiJja2VpeWV4anoxaHB6MnFtejFidTlpZWZlIn0.tvVL0HxRaj_Hk4mWQ7jjHw';

    const map = new mapboxgl.Map({
                    container: this.mapa.nativeElement,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [lng, lat],
                    zoom: 15
    });

    new mapboxgl.Marker()
                .setLngLat( [lng, lat] )
                .addTo(map);
  }

}
