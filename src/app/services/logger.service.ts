import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }


  consoleLog(title: string, body: any) {
    if (environment.production) return;
    console.log(title);
    console.log(body);
  }
}
