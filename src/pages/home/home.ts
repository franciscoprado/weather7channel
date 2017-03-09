import { Component } from '@angular/core';
import { Events, NavController, LoadingController } from 'ionic-angular';
import { WeatherService } from '../../services/weather';
import { Geolocation } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  private tempo: any;
  private loader: any;

  constructor(public navCtrl: NavController, public localWeather: WeatherService, public events: Events, public loadingCtrl: LoadingController) {
    this.tempo = localWeather;

    this.addChangeCityEventListener(events);
    this.addPreloaderEventListener(events);
    this.addGeolocationSupport();
  }

  addChangeCityEventListener(events: Events) {
    events.subscribe('changeCity', (city) => {
      console.log('mudou para', city);
    });
  }

  addPreloaderEventListener(events: Events) {
    this.loader = this.loadingCtrl.create({
      content: "Aguarde, carregando previsão..."
    });
    this.loader.present();

    events.subscribe('forecastLoaded', (status) => {
      if (status == '200') {

      }
    });
  }

  addGeolocationSupport() {
    Geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      this.tempo.obterPrevisaoPorCidade();
      console.log('Error getting location', error);
    });

    let watch = Geolocation.watchPosition();

    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log("COORDENADAS: ", data.coords);
      this.tempo.obterPrevisaoPorCoordenadas(data.coords.latitude, data.coords.longitude);
    });
  }

}
