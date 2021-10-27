import { Quote } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Property } from 'src/app/ng-property';
import { LoggerService } from 'src/app/modules/shared/services/logger.service';
import { RaceService } from 'src/app/modules/racing/services/race/race.service';
import { PlayObject, LetterObject } from '../../../../models/playobject.model';
import { UiService } from 'src/app/modules/shared/services/ui/ui.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  constructor(private _raceService: RaceService,
    private _uiService: UiService,
    private _loggerService: LoggerService,
    private route: ActivatedRoute
  ) {

    this.route.queryParams.subscribe((d: Params) => this.gameType = d['type']);
  }

  gameType: 'normal' | 'difficult' = 'normal';

  @ViewChild('input', { static: false }) input!: ElementRef<HTMLInputElement>;
  typingArray: PlayObject[] = [];
  gameStatus: 'game starting' | 'playing' | 'completed' = "game starting";
  timer: number = 4;
  inputValue = "";
  currentObject!: PlayObject;
  currentQuote!: Quote;

  //For speed calculation 
  totalSeconds = 0;
  score = 0;
  scoreInterval!: Subscription;
  //Subscriptions 

  startInterval!: Subscription;
  fetchSubscription!: Subscription;

  //error
  error = false;
  typingError = false;

  // For letter correct
  currentLetters: Set<LetterObject> = new Set<LetterObject>();
  currentLetterId!: number;
  errorLetters: string[] = [];

  ngOnInit(): void {
    this.initGame();
  }

  initGame() {
    let sub;
    if (this.gameType == 'difficult') {
      sub = this._raceService.fetchText();
    }
    else {
      sub = this._raceService.fetchQuotes();
    }
    this._uiService.loading.startLoading();
    this.fetchSubscription = sub.subscribe(
      quote => {
        this.error = false;
        this.emptyAll();
        this.gameStatus = "playing";
        this.typingArray = this._raceService.createRaceObject(quote.text!);
        this._uiService.loading.stopLoading();
        this.startTimer();
      },
      err => {
        if (this.gameType = "normal") {
          this.gameType = "difficult";
          return this.initGame();
        };
        this._loggerService.consoleLog('Data Fetch Error RaceComponent', err);
        this.error = true;
      }
    );
  }

  emptyAll() {
    this.currentLetters?.clear();
    this.typingArray = [];
    this.currentLetterId = -1;
  }

  startTimer() {
    this.startPlaying();
  }

  keyPressed(event: KeyboardEvent): any {
    let obj = this.currentObject;
    this.typingError = obj.error = (obj.text?.indexOf(this.inputValue) != 0);

    this.handleLetters(obj, event);

    if (obj.text !== this.inputValue) return;

    obj.completed = true;

    this.inputValue = "";

    if (obj.id + 1 == this.typingArray.length) {
      this.currentObject = <PlayObject>{};
      this.gameStatus = "completed";
      return this.calculateScore();

    }

    this.currentObject = this.typingArray[obj.id + 1];
  }

  handleLetters(obj: PlayObject, event: KeyboardEvent) {

    const index = this.inputValue.length;
    if (index == 0) return this.currentLetterId = -1;
    this.currentLetterId = obj?.letters[index - 1]?.id ?? this.currentLetterId;

    return;
  }


  startPlaying() {
    this.score = 0;
    this.totalSeconds = 0;
    this.currentObject = this.typingArray[0];

    // this._raceService.postMessage(WM.calculateScore$, { typingArray: this.typingArray });
    this.scoreInterval = interval(2000).subscribe(() => this.calculateScore());

    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.select();
    });
  }

  calculateScore() {

    if (this.gameStatus == 'completed') {
      this.scoreInterval?.unsubscribe();
      return;
    }
    // if (this._raceService.workerSupported) return this.calculateWithWorker();
    this.totalSeconds += 2;
    let totalWordsTyped = this.typingArray?.indexOf(this.currentObject);
    this.score = parseInt((totalWordsTyped / (this.totalSeconds / 60)).toString());
  }

  // calculateWithWorker() {
  //   this._raceService.postMessage(WM.calculateScore$, this.currentObject);
  // }

  restart() {
    this.initGame();
  }

  ngOnDestroy() {
    this.fetchSubscription?.unsubscribe();
    this.scoreInterval?.unsubscribe();
  }


}
