import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

@Injectable()
export class WeatherService {
    private http: any;
    private data: any;
    private readonly WEATHER_API_KEY: string = "7d29c85b415d4474c680c00a31a60eb9";
    private url_current_weather = "http://api.openweathermap.org/data/2.5/weather?lang=pt&lat={LATITUDE}&lon={LONGITUDE}&units=metric&appid="
    private url_forecast: string = "http://api.openweathermap.org/data/2.5/forecast/daily?lang=pt&lat={LATITUDE}&lon={LONGITUDE}&cnt=5&units=metric&appid=";
    private url_google_geocoding: string = "https://maps.googleapis.com/maps/api/geocode/json?address={ENDERECO}"

    public local: any = "Seu local";
    public weather: any;
    public temp: any;
    public forecasts: Array<Object> = [];

    constructor(http: Http, public events: Events) {
        this.events = events;
        this.http = http;
    }

    obterPrevisaoPorCidade(nomeDaCidade: string) {
        let url = this.url_google_geocoding.replace('{ENDERECO}', nomeDaCidade);

        this.events.publish('loadingForecast', '200');

        this.local = nomeDaCidade;

        // primeiro consumimos API do Google para obter coordenadas a partir do endereço
        this.http.get(url)
            .subscribe(res => {
                let address: any = res.json();
                let latitude: number = address.results[0].geometry.location.lat;
                let longitude: number = address.results[0].geometry.location.lng;

                //console.log("GEOCODE: ", latitude, longitude);

                this.obterTempoAtual(latitude, longitude);
            }, error => {
                console.log(error);
            });
    }

    obterPrevisaoPorCoordenadas(latitude: any, longitude: any) {
      this.obterTempoAtual(latitude, longitude);
    }

    // primeiro obtém o tempo atual, depois carregará previsão, pois usa outra URL da API
    obterTempoAtual(latitude: any, longitude: any) {
        let url = this.url_current_weather.replace('{LATITUDE}', latitude).replace('{LONGITUDE}', longitude) + this.WEATHER_API_KEY;

        this.http.get(url)
            .subscribe(res => {
                this.data = res.json();
                this.temp = this.data.main.temp;
                this.weather = this.data.weather[0].description;
                //console.log("CURRENT: ", this.data);

                this.obterPrevisao(latitude, longitude);
            }, error => {
                console.log(error);
            });
    }

    // a previsão para os próximos dias
    obterPrevisao(latitude: any, longitude: any) {
        let url = this.url_forecast.replace('{LATITUDE}', latitude).replace('{LONGITUDE}', longitude) + this.WEATHER_API_KEY;

        this.forecasts = [];

        this.http.get(url)
            .subscribe(res => {
                this.data = res.json();
                //this.temp = this.data.main.temp;
                this.events.publish('forecastLoaded', '200');

                for (let i = 0; i < this.data.list.length; i++) {
                    let dt: Date = this.converterTimestamp(this.data.list[i].dt);
                    let day: number = this.data.list[i].temp.day;
                    let min: number = this.data.list[i].temp.min;
                    let max: number = this.data.list[i].temp.max;

                    this.forecasts.push({
                        'dt': dt,
                        'day': day,
                        'min': min,
                        'max': max
                    })
                }

                console.log("PREVISÃO: ", this.forecasts);
            }, error => {
                console.log(error);
            });
    }

    converterTimestamp(dt: number):Date {
        var date = new Date(dt * 1000);

        return date;
    }
}
