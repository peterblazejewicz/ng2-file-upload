import { EventEmitter } from '@angular/core';

import { FileUploadItem } from './file-upload-item';
import { FileUploaderOptions } from './file-uploader-options';
import { FileUploaderImpl } from './core/file-uploader.impl';
import { FilterFunction } from './core/interfaces';

export class FileUploader {
  private uploader: FileUploaderImpl;

  get notUploadedItems(): any {
    return this.uploader.notUploadedItems;
  }
  get options(): FileUploaderOptions {
    return this.uploader.options;
  }

  get queue(): FileUploadItem[] {
    return this.uploader.queue;
  }

  get progress(): number {
    return this.uploader.progress;
  }

  get response(): EventEmitter<any> {
    return this.uploader.response;
  }

  get uploading(): boolean {
    return this.uploader.uploading;
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
