import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';
import { LetterObject, PlayObject, Quote, RaceService } from 'src/app/services/race.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  constructor(private _raceService: RaceService,
    private _loggerService: LoggerService
  ) { }

  @ViewChild('input', { static: false }) input!: ElementRef<HTMLInputElement>;
  text = "";
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


  // For letter correct
  currentLetters: Set<LetterObject> = new Set<LetterObject>();
  currentLetterId!: number;
  errorLetters: string[] = [];

  ngOnInit(): void {

    this.initGame();

  }

  initGame() {
    this.fetchSubscription = this._raceService.fetchText().subscribe(
      quote => {
        this.error = false;
        this.emptyAll();
        this.gameStatus = "playing";
        this.typingArray = this._raceService.createRaceObject(quote.text!);

        this._loggerService.consoleLog("RaceComponent", this.typingArray);

        this.startTimer();
      },
      err => {
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
    // this.startInterval = interval(1000).subscribe(d => {
    //   this.timer--;
    //   if (d > 2) {
    //     this.startInterval.unsubscribe();
    //     this.timer = 4;

    //     this.startPlaying();
    //   }
    // });
  }

  keyPressed(event: KeyboardEvent): any {
    let obj = this.currentObject;
    obj.error = !obj.text?.includes(this.inputValue);

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
    // if (obj.text === this.inputValue) return this.currentLetters?.clear();
    // if (event.keyCode != 8) return this.currentLetters?.add(obj?.letters[index - 1]);
    // if (!event.ctrlKey) return this.currentLetters?.delete(obj.letters[index]);
    // return this.currentLetters.clear();
  }


  startPlaying() {
    this.score = 0;
    this.totalSeconds = 0;
    this.currentObject = this.typingArray[0];
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
    this.totalSeconds += 2;
    let totalWordsTyped = this.typingArray?.indexOf(this.currentObject);
    this.score = parseInt((totalWordsTyped / (this.totalSeconds / 60)).toString());
  }

  restart() {
    this.initGame();
  }

  ngOnDestroy() {
    this.fetchSubscription?.unsubscribe();
    this.scoreInterval?.unsubscribe();
  }


}
