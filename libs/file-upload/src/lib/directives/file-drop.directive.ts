import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { FileUploader } from '../file-uploader';
import { FileUploaderOptions } from '../model/file-uploader-options';

@Directive({ selector: '[ng2FileDrop]' })
export class FileDropDirective {
  @Input() public uploader: FileUploader;
  @Output() public fileOver: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onFileDrop: EventEmitter<File[]> = new EventEmitter<
    File[]
  >();

  constructor(private element: ElementRef) {}

  get options(): FileUploaderOptions {
    return this.uploader.options;
  }

  get filters(): any {
    return {};
  }

  @HostListener('drop', ['$event'])
  onDrop(event: Event): void {
    const transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    this._preventAndStop(event);
    this.uploader.addToQueue(transfer.files, this.options, this.filters);
    this.fileOver.emit(false);
    this.onFileDrop.emit(transfer.files);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: Event): void {
    const transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: Event): any {
    if (this.element) {
      if (event.currentTarget === this.element[0]) {
        return;
      }
    }

    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  protected _getTransfer(event: any): any {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer; // jQuery fix;
  }

  protected _preventAndStop(event: Event): any {
    event.preventDefault();
    event.stopPropagation();
  }

  protected _haveFiles(types: any): any {
    if (!types) {
      return false;
    }

    if (types.indexOf) {
      return types.indexOf('Files') !== -1;
    } else if (types.contains) {
      return types.contains('Files');
    } else {
      return false;
    }
  }
}
