import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';
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

  public database: SQLite;
  public bookmarks: Array<string> = [];

  constructor(private platform: Platform, public events: Events, public cityList: CityListService) {
    this.home = HomePage;
    this.city = CityPage;
    this.events = events;
    this.cityList = cityList;

    this.createDatabase();
    this.addUpdateBookmarksEventListener();
  }

  createDatabase() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      let db = new SQLite();

      db.openDatabase({
          name: "data.db",
          location: "default"
      }).then(() => {
          db.executeSql("CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY AUTOINCREMENT, city VARCHAR(250))", {}).then((data) => {
              console.log("TABLE CREATED: ", data);
          }, (error) => {
              console.error("Unable to execute sql", error);
          })
      }, (error) => {
          console.error("Unable to open database", error);
      });

    });

    this.initDatabase();
  }

  addUpdateBookmarksEventListener() {
    this.events.subscribe('updateBookmarks', () => {
        this.refreshData();
    });
  }

  initDatabase() {
    this.platform.ready().then(() => {
        this.database = new SQLite();
        this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
            this.refreshData();
        }, (error) => {
            console.log("ERROR: ", error);
        });
    });
  }

  refreshData() {
      this.database.executeSql("SELECT * FROM bookmarks", []).then((data) => {
          this.bookmarks = [];

          if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                  this.bookmarks.push(data.rows.item(i).city);
              }
          }

      }, (error) => {
          console.log("ERROR: " + JSON.stringify(error));
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
