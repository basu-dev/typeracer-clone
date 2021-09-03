import { ApplicationRef, Component } from '@angular/core';
import { RaceService } from './services/race.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'typeracer';
  constructor(private ref: ApplicationRef) {

  }
  routeActivated() {
    this.ref.tick();
    console.log('ref ticked');
  }
  ngOnInit() {
    console.log('hello');
    // if (typeof Worker !== 'undefined') {
    //   // this._raceService.initWorker();
    //   // Create a new
    // } else {
    //   // Web Workers are not supported in this environment.
    //   // You should add a fallback so that your program still executes correctly.
    // }
    // console.clear();

  }
  ngOnDestroy() {
    // console.log('on destroy called');
    // this._raceService.terminateWorker();
  }

}
