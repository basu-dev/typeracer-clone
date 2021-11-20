import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, tap } from "rxjs/operators";
import { LetterObject, PlayObject, Quote } from '../../../../models/playobject.model';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor(
  ) { }

  DIFFICULT_TEXT_KEY = "difficultText";
  NORMAL_TEXT_KEY = "normalText";

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
  fetchQuotes(): Observable<Quote> {
    return from(fetch('https://goquotes-api.herokuapp.com/api/v1/random?count=1').then(res => res.json())).pipe(
      map((response: any) => response.quotes[0])
    );
  }

  fetchText(): Observable<Quote> {
    return from(fetch('https://random-word-api.herokuapp.com/word?number=200000').then(res => res.json()))
      .pipe(
        map(res => <Quote>{
          text: res.join(' ')
        })
      );
  }

  saveDifficultText(res: any) {
    console.log(res);
    let items = JSON.parse(localStorage.getItem(this.DIFFICULT_TEXT_KEY)!) ?? [];
    items.push(res);
    localStorage.setItem(this.DIFFICULT_TEXT_KEY, items);
    return;
  }




}
