import { NgModule } from '@angular/core';
import { RaceComponent } from './pages/race/race.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  { path: '', component: RaceComponent }
];


@NgModule({
  declarations: [
    RaceComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class RacingModule { }
