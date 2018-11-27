import { EventEmitter } from '@angular/core';

import { FileUploadItem } from '..';
import { FileUploaderImpl } from './implementation/file-uploader.impl';
import { FileUploaderOptions } from './model/file-uploader-options';
import { FilterFunction } from './model/filter-function';
import { IFileUploadItem } from './model/file-upload-item-interface';

export class FileUploader {
  private uploader: FileUploaderImpl;

  get notUploadedItems(): any {
    return this.uploader.getNotUploadedItems();
  }
  get options(): FileUploaderOptions {
    return this.uploader.options;
  }

  get queue(): IFileUploadItem[] {
    return this.uploader.queue;
  }

  get response(): EventEmitter<any> {
    return this.uploader.response;
  }

  constructor(options: FileUploaderOptions) {
    this.uploader = new FileUploaderImpl(options);
  }

  addToQueue(
    files: File[],
    options?: FileUploaderOptions,
    filters?: FilterFunction[] | string
  ): void {
    this.uploader.addToQueue(files, options, filters);
  }

  cancelAll(): void {
    this.uploader.cancelAll();
  }

  cancelItem(item: FileUploadItem): void {
    this.uploader.cancelItem(item);
  }

  clearQueue(): void {
    this.uploader.clearQueue();
  }

  removeFromQueue(item: FileUploadItem): void {
    this.uploader.removeFromQueue(item);
  }

  uploadAll(): void {
    this.uploader.uploadAll();
  }

  uploadItem(item: FileUploadItem): void {
    this.uploader.uploadItem(item);
  }
}
