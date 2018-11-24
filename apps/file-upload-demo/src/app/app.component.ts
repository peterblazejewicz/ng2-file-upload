import { AfterContentInit, Component } from '@angular/core';

import * as gettingStarted from 'html-loader!markdown-loader!../../src/docs/getting-started.md';

declare var PR: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  gettingStarted: string = gettingStarted;

  ngAfterContentInit() {
    setTimeout(() => {
      if (typeof PR !== 'undefined') {
        // google code-prettify
        PR.prettyPrint();
      }
    }, 150);
  }
}
