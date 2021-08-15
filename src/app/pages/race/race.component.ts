import { Quote } from '@angular/compiler';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { PlayObject, RaceService } from 'src/app/services/race.service';

@Component({
  selector: 'app-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss']
})
export class RaceComponent implements OnInit {

  constructor(private _raceService: RaceService) { }

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  text = "";
  typingArray: PlayObject[] = [];
  gameStatus: 'game starting' | 'playing' | 'completed' = "game starting";
  timer: number = 4;
  inputValue = "";
  currentObject!: PlayObject;
  currentQuote!: Quote;

  //Subscriptions 

  startInterval!: Subscription;
  fetchSubscription!: Subscription;

  ngOnInit(): void {

    this.initGame();

  }

  initGame() {

    this.typingArray = [];
    this.fetchSubscription = this._raceService.fetchText().subscribe(
      quote => this.typingArray = this._raceService.createRaceObject(quote.quote),
      err => console.log(err)
    );
    this.startTimer();

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
    console.log(this.currentObject);
    let obj = this.currentObject;
    obj.error = !obj.text.includes(this.inputValue);
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
    this.gameStatus = "playing";
    console.log(this.input);
    this.input.nativeElement.focus();
    this.currentObject = this.typingArray[0];
  }

  restart() {
    this.initGame();
  }

  ngOnDestroy() {
    this.fetchSubscription?.unsubscribe();
  }

}
