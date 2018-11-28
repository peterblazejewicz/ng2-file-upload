import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { FileUploader } from '../file-uploader';
import { FileUploaderOptions } from '../file-uploader-options';

@Directive({ selector: '[ng2FileSelect]' })
export class FileSelectDirective {
  @Input() public uploader: FileUploader;
  @Output() public fileSelected: EventEmitter<File[]> = new EventEmitter<
    File[]
  >();

  constructor(private element: ElementRef) {}

  get options(): FileUploaderOptions {
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
    this.fileSelected.emit(files);

    if (this.isEmptyAfterSelection) {
      this.element.nativeElement.value = '';
    }
  }
}
