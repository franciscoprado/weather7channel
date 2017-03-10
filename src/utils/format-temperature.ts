import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatTemperature'})
export class FormatTemperaturePipe implements PipeTransform {
    transform(value: any, arg): any {
        if (value != null) {
            return Math.round(value) + 'º C';
        }

        return '';
    }
}