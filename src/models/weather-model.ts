export class WeatherModel {

    constructor(public city: string){
        this.city = city;
    }

    public getCity():string {
        return this.city;
    }
}