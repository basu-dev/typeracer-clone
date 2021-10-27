import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor() { }

  private _loading$ = new Subject<boolean>();
  public loading = {
    loadingSub$: this._loading$.asObservable(),
    startLoading: () => {
      this._loading$.next(true);
    },
    stopLoading: () => {
      this._loading$.next(false);
    }
  };




}
