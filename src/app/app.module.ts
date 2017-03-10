import { NgModule  } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CityPage } from '../pages/city/city';
import { WeatherService } from '../services/weather';
import { CityListService } from '../services/city-list';
import { FormatTemperaturePipe } from '../utils/format-temperature';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CityPage,
    FormatTemperaturePipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CityPage
  ],
  providers: [WeatherService, CityListService]
  //providers:[{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
