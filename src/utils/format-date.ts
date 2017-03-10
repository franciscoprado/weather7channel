import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
    transform(value: Date, arg): any {
        let day: number = value.getDay();
        let month: number = value.getMonth() + 1;
        let fday: string = value.getDay().toString();
        let fmonth: string = value.getMonth().toString();

        if (day < 10) {
            fday = '0' + day.toString();
        }

        if (month < 10) {
            fmonth = '0' + month.toString();
        }

        return fday + '/' + fmonth;
    }
}