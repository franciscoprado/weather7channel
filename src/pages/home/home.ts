import { Component } from '@angular/core';
import { Events, NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { WeatherService } from '../../services/weather';
import { Geolocation, SQLite } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  private tempo: any;
  private loader: any;
  private use_geo: boolean = true;

  public database: SQLite;

  constructor(public navCtrl: NavController, public localWeather: WeatherService, public events: Events, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private platform: Platform) {
    this.tempo = localWeather;

    this.initDatabase();
    this.addChangeCityEventListener(events);
    this.addPreloaderEventListener(events);
    this.addLoadingForecastEventListener(events);
    this.addGeolocationSupport();
  }

  initDatabase() {
    this.platform.ready().then(() => {
        this.database = new SQLite();
        this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
            console.log('Banco aberto com sucesso.');
        }, (error) => {
            console.log("ERROR: ", error);
        });
    });
  }

  addFavorite(city: string) {
    console.log('FAVORITAR', city);

    this.database.executeSql("INSERT INTO bookmarks (city) VALUES ('" + city + "')", []).then((data) => {
        console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
        console.log("ERROR: " + JSON.stringify(error.err));
    });
  }

  addLoadingForecastEventListener(events: Events) {
    events.subscribe('loadingForecast', () => {
      this.generatePreloader();
    });
  }

  addChangeCityEventListener(events: Events) {
    events.subscribe('changeCity', (city) => {
      this.tempo.obterPrevisaoPorCidade(city);
      this.desabilitarPrevisaoPorGeolocalizacao();
    });
  }

  desabilitarPrevisaoPorGeolocalizacao() {
    this.use_geo = false;
  }

  addPreloaderEventListener(events: Events) {
    this.generatePreloader();

    events.subscribe('forecastLoaded', (status) => {
      if (status == '200') {
        this.loader.dismiss();
      }
    });
  }

  generatePreloader() {
    this.loader = this.loadingCtrl.create({
      content: "Aguarde, carregando previsão..."
    });
    this.loader.present();
  }

  addGeolocationSupport() {
    Geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch((error) => {
      let alert = this.alertCtrl.create({
        title: 'Erro',
        subTitle: 'Não foi possível obter a previsão do tempo. Verifique se o recurso da geolocalização está ativada.',
        buttons: ['Fechar']
      });
      alert.present();
      console.log('Error getting location', error);
    });

    let options = {
      enableHighAccuracy: true
    };
    let watch = Geolocation.watchPosition(options);

    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log("COORDENADAS: ", data.coords);

      if (this.use_geo)
        this.tempo.obterPrevisaoPorCoordenadas(data.coords.latitude, data.coords.longitude);
    });
  }

}
