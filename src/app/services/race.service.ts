import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map } from "rxjs/operators";
import { LetterObject, PlayObject, Quote } from '../pages/models/playobject.model';
import { WM, WorkerMessage } from "../workerMessage";

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor(
  ) { }



  createRaceObject(text: string): PlayObject[] {
    const splittedText = text.split(' ');
    const playObject = splittedText.map((item: string, id: number) => <PlayObject>{
      text: (id + 1 == splittedText.length) ? item : item + ' ',
      letters: this.createLetterObject(item, id),
      id,
      error: false,
      completed: false,
      success: false
    }
    );
    return playObject;
  }

  createLetterObject(text: string, id: number): LetterObject[] {
    let letters = text.split('').map((letter, i) => <LetterObject>{ letter, id: id * 100 + i });
    letters.push({ letter: ' ', id: id * 100 + letters.length });
    return letters;
  }

  // api1 = https://quotes.stormconsultancy.co.uk/random.json
  // fetchText(): Observable<Quote> {
  //   return this._http.get<Quote[]>('https://goquotes-api.herokuapp.com/api/v1/random?count=1').pipe(
  //     map((response: any) => response.quotes[0])
  //   );

  // fetchText(): Observable<Quote> {
  //   return this._http.get<any>("https://random-word-api.herokuapp.com/word?number=20").pipe(
  //     map(res => <Quote>{
  //       text: res.join(' ')
  //     })
  //   );
  // }

  fetchText(): Observable<Quote> {
    return from(fetch('https://random-word-api.herokuapp.com/word?number=20').then(res => res.json()))
      .pipe(
        map(res => <Quote>{
          text: res.join(' ')
        })
      );
  }


}
