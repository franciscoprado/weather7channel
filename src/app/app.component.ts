import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { CityPage } from '../pages/city/city';
import { CityListService } from '../services/city-list';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = HomePage;
  home: any;
  city: any;
  items: string[] = [];

  constructor(platform: Platform, public events: Events, public cityList: CityListService) {
    this.home = HomePage;
    this.city = CityPage;
    this.events = events;
    this.cityList = cityList;

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
    this.cityList.obterListaDeCidades(ev.target.value); // foo bar..
    this.items = this.cityList.resultados;
  }

  changeCity(city: any) {
    this.events.publish('changeCity', city);
  }
}
