import { Component } from '@angular/core';

import * as gettingStarted from 'html-loader!markdown-loader!../../src/docs/getting-started.md';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gettingStarted: string = gettingStarted;
}
