import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

@Injectable()
export class WeatherService {
    private http: any;
    private data: any;
    private readonly WEATHER_API_KEY: string = "7d29c85b415d4474c680c00a31a60eb9";
    private url_coords: string = "http://api.openweathermap.org/data/2.5/forecast?lat={LATITUDE}&lon={LONGITUDE}&units=metric&appid=";
    private url_google_geocoding: string = "https://maps.googleapis.com/maps/api/geocode/json?address={ENDERECO}"

    public temp: any;

    constructor(http: Http, public events: Events) {
        this.events = events;
        this.http = http;
    }

    obterPrevisaoPorCidade(nomeDaCidade: string) {
        var url_geo = this.url_google_geocoding.replace('{ENDERECO}', nomeDaCidade);

        this.events.publish('loadingForecast', '200');

        // primeiro consumimos API do Google para obter coordenadas a partir do endereço
        this.http.get(url_geo)
            .subscribe(res => {
                let address: any = res.json();
                let latitude: number = address.results[0].geometry.location.lat;
                let longitude: number = address.results[0].geometry.location.lng;

                console.log("GEOCODE: ", latitude, longitude);

                this.obterPrevisaoPorCoordenadas(latitude, longitude);
            }, error => {
                console.log(error);
            });
    }

    obterPrevisaoPorCoordenadas(latitude: any, longitude: any) {
      var url = this.url_coords.replace('{LATITUDE}', latitude).replace('{LONGITUDE}', longitude) + this.WEATHER_API_KEY;

      this.http.get(url)
          .subscribe(res => {
              this.data = res.json();
              this.temp = this.data.list[0].main.temp;
              this.events.publish('forecastLoaded', '200');
              console.log("RESULTADO: ", this.data);
          }, error => {
              console.log(error);
          });
    }
}
