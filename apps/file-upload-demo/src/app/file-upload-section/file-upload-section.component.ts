import { Component } from '@angular/core';
import * as doc from 'html-loader!markdown-loader!../../../src/docs/doc.md';

const tabDesc: Array<any> = [
  {
    heading: 'Simple',
    ts: require('!raw-loader?lang=typescript!../simple-demo/simple-demo.component.ts'),
    html: require('!raw-loader?lang=markup!../simple-demo/simple-demo.component.html'),
    js: require('!raw-loader?lang=javascript!../simple-demo/file-catcher.js')
  }
];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'file-upload-section',
  templateUrl: './file-upload-section.component.html',
  styleUrls: ['./file-upload-section.component.scss']
})
export class FileUploadSectionComponent {
  name = 'File Upload';
  currentHeading = 'Simple';
  doc: string = doc;
  tabs: any = tabDesc;

  public select(e: any): void {
    if (e.heading) {
      this.currentHeading = e.heading;
    }
  }
}
