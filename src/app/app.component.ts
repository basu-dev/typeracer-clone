import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UiService } from './modules/shared/services/ui/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'typeracer';
  constructor(private router: Router, private _uiService: UiService, private _cdr: ChangeDetectorRef) {

  }
  loading = true;
  ngOnInit() {
    this.listenRouterEvents();
    this.listenLoading();
    console.clear();
  }

  listenLoading() {
    this._uiService.loading.loadingSub$.subscribe(d => {
      this.loading = d;
      this._cdr.detectChanges();
    });
  }

  listenRouterEvents() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
      } else if (event instanceof NavigationCancel) {
        this.loading = false;
      } else if (event instanceof NavigationError) {
        this.loading = false;
      }
    });
  }
  ngOnDestroy() {
  }

}
