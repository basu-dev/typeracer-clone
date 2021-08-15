import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RaceComponent } from './pages/race/race.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
  },
  {
    path: 'race', component: RaceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
