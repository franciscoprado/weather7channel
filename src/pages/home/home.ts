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
  private latitude: number;
  private longitude: number;
  private use_geo: boolean = true;
  private update_limit: number = 60;
  private timer: number = 0;  

  public already_bookmarked: boolean;
  public database: SQLite;

  constructor(public navCtrl: NavController, public localWeather: WeatherService, public events: Events, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private platform: Platform) {
    this.tempo = localWeather;

    this.initDatabase();
    this.addChangeCityEventListener(events);
    this.addPreloaderEventListener(events);
    this.addLoadingForecastEventListener(events);
    this.addGeolocationSupport();
    this.startTimer();
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

  addBookmark(city: string) {
    this.already_bookmarked = true;

    this.showAlert();

    this.database.executeSql("INSERT INTO bookmarks (city) VALUES ('" + city + "')", []).then((data) => {
        console.log("INSERTED: " + JSON.stringify(data));
    }, (error) => {
        console.log("ERROR: " + JSON.stringify(error.err));
    });

    this.events.publish('updateBookmarks', city);
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      subTitle: 'O endereço atual foi adicionado à lista de favoritos.',
      buttons: ['OK']
    });
    alert.present();
  }

  checkIsBookmarked(city: string) {
    this.database.executeSql("SELECT * FROM bookmarks WHERE city LIKE '" + city + "'", []).then((data) => {
        if (data.rows.length > 0) {
            this.already_bookmarked = true;
        }
        else {
          this.already_bookmarked = false;
        }

    }, (error) => {
        console.log("ERROR: " + JSON.stringify(error));
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
      this.checkIsBookmarked(city);
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
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 30000
    };
    let watch = Geolocation.watchPosition(options);

    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log("COORDENADAS: ", data.coords);

      this.events.publish('coordinatesUpdated', data.coords.latitude, data.coords.longitude);
      
      // atualização somente a cada 60 segundos
      if (this.use_geo) {
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;        
      }
    });
  }

  startTimer() {
    setInterval(tick, 1000);
    let self = this;

    function tick() {
      // reinicia o timer caso passe do limite
      if (self.timer > self.update_limit) {
        self.timer = 0;
      }

      // atualiza caso tenha completado o ciclo, ou então é o início da execução do app
      if (self.timer == 0) {
        self.tempo.obterPrevisaoPorCoordenadas(self.latitude, self.longitude);
      }

      self.timer += 1;
    }
  }

}
