import { Component } from '@angular/core';
import * as doc from 'html-loader!markdown-loader!../../../src/docs/doc.md';


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


  public select(e: any): void {
    if (e.heading) {
      this.currentHeading = e.heading;
    }
  }
}
