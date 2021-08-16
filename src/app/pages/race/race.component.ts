import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';
import { PlayObject, Quote, RaceService } from 'src/app/services/race.service';

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
  scoreInterval: any;
  //Subscriptions 

  startInterval!: Subscription;
  fetchSubscription!: Subscription;


  //error
  error = false;

  ngOnInit(): void {

    this.initGame();

  }

  initGame() {

    this.fetchSubscription = this._raceService.fetchText().subscribe(
      quote => {
        this.error = false;
        this.typingArray = [];
        this.gameStatus = "playing";
        this.startTimer();
        this.typingArray = this._raceService.createRaceObject(quote.text!);
      },
      err => {
        this._loggerService.consoleLog('Data Fetch Error RaceComponent', err);
        this.error = true;
      }
    );

  }

  startTimer() {

    this.startInterval = interval(1000).subscribe(d => {
      this.timer--;
      if (d > 2) {
        this.startInterval.unsubscribe();
        this.timer = 4;

        this.startPlaying();
      }
    });
  }

  keyPressed(): any {
    let obj = this.currentObject;
    obj.error = !obj.text?.includes(this.inputValue);
    if (obj.text !== this.inputValue) return;
    obj.completed = true;
    this.inputValue = "";
    if (obj.id + 1 == this.typingArray.length) {
      this.currentObject = <PlayObject>{};
      return this.gameStatus = "completed";
    }
    this.currentObject = this.typingArray[obj.id + 1];
  }

  startPlaying() {


    this.score = 0;
    this.totalSeconds = 0;
    this.currentObject = this.typingArray[0];

    this.scoreInterval = setInterval(() => this.calculateScore(), 2000);

    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.select();
    });
  }

  calculateScore() {

    if (this.gameStatus == 'completed') {
      clearInterval(this.scoreInterval);

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
    clearInterval(this.scoreInterval);
  }

}
