import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { CityPage } from '../pages/city/city';
import { WeatherModel } from '../models/weather-model';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = HomePage;
  home: any;
  city: any;
  items: string[] = [];

  constructor(platform: Platform) {
    this.home = HomePage;
    this.city = CityPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(opcao) {
    this.rootPage = opcao;
  }

  getItems(ev: any) {
    this.items = ['São Paulo', 'Rio de Janeiro', 'Salvador', 'Belo Horizonte'];
  }

  updateWeather(city: any) {

    new WeatherModel(city);
  }
}
