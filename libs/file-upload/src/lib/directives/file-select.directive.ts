import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';

import { FileUploader } from '../file-uploader';
import { IFileUploaderOptions } from '../model/file-uploader-options';

@Directive({ selector: '[ng2FileSelect]' })
export class FileSelectDirective {
  @Input() public uploader: FileUploader;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onFileSelected: EventEmitter<File[]> = new EventEmitter<
    File[]
  >();

  constructor(private element: ElementRef) {}

  get options(): IFileUploaderOptions {
    return this.uploader.options;
  }

  get filters(): any {
    return {};
  }

  get isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  @HostListener('change')
  onChange(): any {
    const files = this.element.nativeElement.files;
    this.uploader.addToQueue(files, this.options, this.filters);
    this.onFileSelected.emit(files);

    if (this.isEmptyAfterSelection) {
      this.element.nativeElement.value = '';
    }
  }
}
