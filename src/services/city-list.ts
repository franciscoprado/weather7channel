import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

@Injectable()
export class CityListService {
    private http: any;
    private data: any;
    private readonly GOOGLE_PLACES_API_KEY: string = "AIzaSyBSbQS6EEEE4wBGLHm8V9HNPa6AG5FnFcI";
    private url_google: string = "https://maps.googleapis.com/maps/api/place/autocomplete/json?parameters&types=(cities)&input={CIDADE}&key=";

    public resultados: Array<string> = [];

    constructor(http: Http, public events: Events) {
        this.events = events;
        this.http = http;
    }

    obterListaDeCidades(cidade: string = "") {
        // limitando a busca para ao menos 3 ou mais caracteres, para evitar uma lista enorme de cidades
        if (cidade.length >= 2) {
            var url = this.url_google.replace('{CIDADE}', cidade) + this.GOOGLE_PLACES_API_KEY;

            this.http.get(url)
                .subscribe(res => {
                    this.data = res.json();
                    this.resultados = [];
                    let predictions: Array<Object> = this.data.predictions;

                    for (let i = 0; i < predictions.length; i++) {
                        let prediction: Object = predictions[i];

                        this.resultados.push(prediction['description']);
                    }
                }, error => {
                    this.resultados = [];
                    console.log(error);
                });
        }
        else {
            this.resultados = [];
        }
    }

}
