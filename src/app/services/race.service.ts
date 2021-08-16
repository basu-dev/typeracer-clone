import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor(
    private _http: HttpClient
  ) { }

  createRaceObject(text: string): PlayObject[] {
    const splittedText = text.split(' ');
    const playObject = splittedText.map((item: string, id: number) => <PlayObject>{
      text: (id + 1 == splittedText.length) ? item : item + ' ',
      id,
      error: false,
      completed: false,
      success: false
    }
    );
    return playObject;
  }
  // api1 = https://quotes.stormconsultancy.co.uk/random.json
  fetchText(): Observable<Quote> {
    return this._http.get<Quote[]>('https://goquotes-api.herokuapp.com/api/v1/random?count=1').pipe(
      map((response: any) => response.quotes[0])
    );
  };
}


export interface PlayObject {
  text: string,
  id: number,
  error?: boolean,
  success?: boolean,
  completed?: boolean;
}

export interface Quote {
  quote: string,
  text?: string,
  author: string,
}