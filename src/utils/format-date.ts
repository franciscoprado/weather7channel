import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
    transform(value: Date, arg): any {
        let date: number = value.getDate();
        let month: number = value.getMonth() + 1;
        let fdate: string = value.getDate().toString();
        let fmonth: string = value.getMonth().toString();

        if (date < 10) {
            fdate = '0' + date.toString();
        }

        if (month < 10) {
            fmonth = '0' + month.toString();
        }

        return fdate + '/' + fmonth;
    }
}