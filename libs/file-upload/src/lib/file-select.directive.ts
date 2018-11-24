import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';

import { FileUploader } from './file-uploader';

@Directive({ selector: '[ng2FileSelect]' })
export class FileSelectDirective {
  @Input() public uploader: FileUploader;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onFileSelected: EventEmitter<File[]> = new EventEmitter<
    File[]
  >();

  protected element: ElementRef;

  public constructor(element: ElementRef) {
    this.element = element;
  }

  public getOptions(): any {
    return this.uploader.options;
  }

  public getFilters(): any {
    return {};
  }

  public isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  @HostListener('change')
  public onChange(): any {
    const files = this.element.nativeElement.files;
    const options = this.getOptions();
    const filters = this.getFilters();

    this.uploader.addToQueue(files, options, filters);
    this.onFileSelected.emit(files);

    if (this.isEmptyAfterSelection()) {
      this.element.nativeElement.value = '';
    }
  }
}
