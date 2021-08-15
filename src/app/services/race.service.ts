import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor(
    private _http: HttpClient
  ) { }

  createRaceObject(text: string): PlayObject[] {
    let playObject = text.split(' ').map((item: string, id: number) => <PlayObject>{
      text: (id + 2 == text.length) ? item : item + ' ',
      id,
      error: false,
      completed: false,
      success: false
    }
    );
    return playObject;
  }

  fetchText(): Observable<Quote> {
    return this._http.get<Quote>('https://quotes.stormconsultancy.co.uk/random.json');
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
  author: string,
}