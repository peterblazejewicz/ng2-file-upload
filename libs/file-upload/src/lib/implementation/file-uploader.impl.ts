import { EventEmitter } from '@angular/core';

import { FileUploadItem } from '../file-upload-item';
import { FileWrapper } from '../file-wrapper';
import { FileUploaderOptions } from '../model/file-uploader-options';
import { FilterFunction } from '../model/filter-function';
import { ParsedResponseHeaders } from '../model/parsed-response-headers';
import { FileTypeUtils } from '../utils/file-type';
import { CreateFileWrapper } from './file-wrapper.impl';
import { FileUploadItemImpl } from './file-upload-item.impl';

function isFile(value: any): boolean {
  return File && value instanceof File;
}

export class FileUploaderImpl {
  authToken: string;
  uploading = false;
  queue: FileUploadItem[] = [];
  progress = 0;
  _nextIndex = 0;
  autoUpload: any;
  authTokenHeader: string;
  response: EventEmitter<any>;

  options: FileUploaderOptions = {
    autoUpload: false,
    isHtml5: true,
    filters: [],
    removeAfterUpload: false,
    disableMultipart: false,
    formatDataFunction: (item: FileUploadItem) => item.file,
    formatDataFunctionIsAsync: false
  };

  protected _failFilterIndex: number;

  public constructor(options: FileUploaderOptions) {
    this.setOptions(options);
    this.response = new EventEmitter<any>();
  }

  public setOptions(options: FileUploaderOptions): void {
    this.options = Object.assign(this.options, options);

    this.authToken = this.options.authToken;
    this.authTokenHeader = this.options.authTokenHeader || 'Authorization';
    this.autoUpload = this.options.autoUpload;
    this.options.filters.unshift({
      name: 'queueLimit',
      fn: this._queueLimitFilter
    });

    if (this.options.maxFileSize) {
      this.options.filters.unshift({
        name: 'fileSize',
        fn: this._fileSizeFilter
      });
    }

    if (this.options.allowedFileType) {
      this.options.filters.unshift({
        name: 'fileType',
        fn: this._fileTypeFilter
      });
    }

    if (this.options.allowedMimeType) {
      this.options.filters.unshift({
        name: 'mimeType',
        fn: this._mimeTypeFilter
      });
    }
    this.queue.forEach(item => {
      item.url = this.options.url;
    });
  }

  public addToQueue(
    files: File[],
    options?: FileUploaderOptions,
    filters?: FilterFunction[] | string
  ): void {
    const list: File[] = [];
    for (const file of files) {
      list.push(file);
    }
    const arrayOfFilters = this._getFilters(filters);
    const count = this.queue.length;
    const addedFileItems: FileUploadItem[] = [];
    list.map((file: File) => {
      if (!options) {
        options = this.options;
      }

      const temp = CreateFileWrapper(file);
      if (this._isValidFile(temp, arrayOfFilters, options)) {
        const fileItem = new FileUploadItemImpl(this, file, options);
        addedFileItems.push(fileItem);
        this.queue.push(fileItem);
        this._onAfterAddingFile(fileItem);
      } else {
        const filter = arrayOfFilters[this._failFilterIndex];
        this._onWhenAddingFileFailed(temp, filter, options);
      }
    });
    if (this.queue.length !== count) {
      this._onAfterAddingAll(addedFileItems);
      this.progress = this._getTotalProgress();
    }
    this._render();
    if (this.options.autoUpload) {
      this.uploadAll();
    }
  }

  public removeFromQueue(value: FileUploadItem): void {
    const index = this.getIndexOfItem(value);
    const item = this.queue[index];
    if (item.uploading) {
      item.cancel();
    }
    this.queue.splice(index, 1);
    this.progress = this._getTotalProgress();
  }

  public clearQueue(): void {
    while (this.queue.length) {
      this.queue[0].remove();
    }
    this.progress = 0;
  }

  public uploadItem(value: FileUploadItem): void {
    const index = this.getIndexOfItem(value);
    const item = this.queue[index];
    const transport = this.options.isHtml5
      ? '_xhrTransport'
      : '_iframeTransport';
    item.prepareToUploading();
    if (this.uploading) {
      return;
    }
    this.uploading = true;
    (this as any)[transport](item);
  }

  public cancelItem(value: FileUploadItem): void {
    const index = this.getIndexOfItem(value);
    const item = this.queue[index];
    const prop = this.options.isHtml5 ? item.xhr : item.form;
    if (item && item.uploading) {
      prop.abort();
    }
  }

  public uploadAll(): void {
    const items = this.getNotUploadedItems().filter(
      (item: FileUploadItem) => !item.uploading
    );
    if (!items.length) {
      return;
    }
    items.map((item: FileUploadItem) => item.prepareToUploading());
    items[0].upload();
  }

  public cancelAll(): void {
    const items = this.getNotUploadedItems();
    items.map((item: FileUploadItem) => item.cancel());
  }

  public isFile(value: any): boolean {
    return isFile(value);
  }

  public isFileLikeObject(value: any): boolean {
    return value instanceof FileWrapper;
  }

  public getIndexOfItem(value: any): number {
    return typeof value === 'number' ? value : this.queue.indexOf(value);
  }

  public getNotUploadedItems(): any[] {
    return this.queue.filter((item: FileUploadItem) => !item.uploaded);
  }

  public getReadyItems(): any[] {
    return this.queue
      .filter((item: FileUploadItem) => item.ready && !item.uploading)
      .sort((item1: any, item2: any) => item1.index - item2.index);
  }

  public destroy(): void {
    return void 0;
  }

  public onAfterAddingAll(fileItems: any): any {
    return { fileItems };
  }

  public onBuildItemForm(fileItem: FileUploadItem, form: any): any {
    return { fileItem, form };
  }

  public onAfterAddingFile(fileItem: FileUploadItem): any {
    return { fileItem };
  }

  public onWhenAddingFileFailed(
    item: FileWrapper,
    filter: any,
    options: any
  ): any {
    return { item, filter, options };
  }

  public onBeforeUploadItem(fileItem: FileUploadItem): any {
    return { fileItem };
  }

  public onProgressItem(fileItem: FileUploadItem, progress: any): any {
    return { fileItem, progress };
  }

  public onProgressAll(progress: any): any {
    return { progress };
  }

  public onSuccessItem(
    item: FileUploadItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { item, response, status, headers };
  }

  public onErrorItem(
    item: FileUploadItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { item, response, status, headers };
  }

  public onCancelItem(
    item: FileUploadItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { item, response, status, headers };
  }

  public onCompleteItem(
    item: FileUploadItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { item, response, status, headers };
  }

  public onCompleteAll(): any {
    return void 0;
  }

  public _mimeTypeFilter(item: FileWrapper): boolean {
    return !(
      this.options.allowedMimeType &&
      this.options.allowedMimeType.indexOf(item.type) === -1
    );
  }

  public _fileSizeFilter(item: FileWrapper): boolean {
    return !(this.options.maxFileSize && item.size > this.options.maxFileSize);
  }

  public _fileTypeFilter(item: FileWrapper): boolean {
    return !(
      this.options.allowedFileType &&
      this.options.allowedFileType.indexOf(FileTypeUtils.getMimeClass(item)) ===
        -1
    );
  }

  public _onErrorItem(
    item: FileUploadItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    item.onError(response, status, headers);
    this.onErrorItem(item, response, status, headers);
  }

  public _onCompleteItem(
    item: FileUploadItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    item.onComplete(response, status, headers);
    this.onCompleteItem(item, response, status, headers);
    const nextItem = this.getReadyItems()[0];
    this.uploading = false;
    if (nextItem) {
      nextItem.upload();
      return;
    }
    this.onCompleteAll();
    this.progress = this._getTotalProgress();
    this._render();
  }

  protected _headersGetter(parsedHeaders: ParsedResponseHeaders): any {
    return (name: any): any => {
      if (name) {
        return parsedHeaders[name.toLowerCase()] || void 0;
      }
      return parsedHeaders;
    };
  }

  protected _xhrTransport(item: FileUploadItem): any {
    const that = this;
    const xhr = (item.xhr = new XMLHttpRequest());
    let sendable: any;
    this._onBeforeUploadItem(item);

    if (typeof item.file.size !== 'number') {
      throw new TypeError('The file specified is no longer valid');
    }
    if (!this.options.disableMultipart) {
      sendable = new FormData();
      this._onBuildItemForm(item, sendable);

      const appendFile = () =>
        sendable.append(item.alias, item.file, item.fileWrapper.name);
      if (!this.options.parametersBeforeFiles) {
        appendFile();
      }

      // For AWS, Additional Parameters must come BEFORE Files
      if (this.options.additionalParameter !== undefined) {
        Object.keys(this.options.additionalParameter).forEach((key: string) => {
          let paramVal = this.options.additionalParameter[key];
          // Allow an additional parameter to include the filename
          if (
            typeof paramVal === 'string' &&
            paramVal.indexOf('{{file_name}}') >= 0
          ) {
            paramVal = paramVal.replace('{{file_name}}', item.fileWrapper.name);
          }
          sendable.append(key, paramVal);
        });
      }

      if (this.options.parametersBeforeFiles) {
        appendFile();
      }
    } else {
      sendable = this.options.formatDataFunction(item);
    }

    xhr.upload.onprogress = (event: any) => {
      const progress = Math.round(
        event.lengthComputable ? (event.loaded * 100) / event.total : 0
      );
      this._onProgressItem(item, progress);
    };
    xhr.onload = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      const response = this._transformResponse(xhr.response, headers);
      const gist = this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
      const method = '_on' + gist + 'Item';
      (this as any)[method](item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.onerror = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      const response = this._transformResponse(xhr.response, headers);
      this._onErrorItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.onabort = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      const response = this._transformResponse(xhr.response, headers);
      this._onCancelItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.open(item.method, item.url, true);
    xhr.withCredentials = item.withCredentials;
    if (this.options.headers) {
      for (const header of this.options.headers) {
        xhr.setRequestHeader(header.name, header.value);
      }
    }
    if (item.headers.length) {
      for (const header of item.headers) {
        xhr.setRequestHeader(header.name, header.value);
      }
    }
    if (this.authToken) {
      xhr.setRequestHeader(this.authTokenHeader, this.authToken);
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        that.response.emit(xhr.responseText);
      }
    };
    if (this.options.formatDataFunctionIsAsync) {
      sendable.then((result: any) => xhr.send(JSON.stringify(result)));
    } else {
      xhr.send(sendable);
    }
    this._render();
  }

  protected _getTotalProgress(value: number = 0): number {
    if (this.options.removeAfterUpload) {
      return value;
    }
    const notUploaded = this.getNotUploadedItems().length;
    const uploaded = notUploaded
      ? this.queue.length - notUploaded
      : this.queue.length;
    const ratio = 100 / this.queue.length;
    const current = (value * ratio) / 100;
    return Math.round(uploaded * ratio + current);
  }

  protected _getFilters(filters: FilterFunction[] | string): FilterFunction[] {
    if (!filters) {
      return this.options.filters;
    }
    if (Array.isArray(filters)) {
      return filters;
    }
    if (typeof filters === 'string') {
      const names = filters.match(/[^\s,]+/g);
      return this.options.filters.filter(
        (filter: any) => names.indexOf(filter.name) !== -1
      );
    }
    return this.options.filters;
  }

  protected _render(): any {
    return void 0;
  }

  protected _queueLimitFilter(): boolean {
    return (
      this.options.queueLimit === undefined ||
      this.queue.length < this.options.queueLimit
    );
  }

  protected _isValidFile(
    file: FileWrapper,
    filters: FilterFunction[],
    options: FileUploaderOptions
  ): boolean {
    this._failFilterIndex = -1;
    return !filters.length
      ? true
      : filters.every((filter: FilterFunction) => {
          this._failFilterIndex++;
          return filter.fn.call(this, file, options);
        });
  }

  protected _isSuccessCode(status: number): boolean {
    return (status >= 200 && status < 300) || status === 304;
  }

  protected _transformResponse(
    response: string,
    headers: ParsedResponseHeaders
  ): string {
    return response;
  }

  protected _parseHeaders(headers: string): ParsedResponseHeaders {
    const parsed: any = {};
    let key: any;
    let val: any;
    let i: any;
    if (!headers) {
      return parsed;
    }
    headers.split('\n').map((line: any) => {
      i = line.indexOf(':');
      key = line
        .slice(0, i)
        .trim()
        .toLowerCase();
      val = line.slice(i + 1).trim();
      if (key) {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });
    return parsed;
  }

  protected _onWhenAddingFileFailed(
    item: FileWrapper,
    filter: any,
    options: any
  ): void {
    this.onWhenAddingFileFailed(item, filter, options);
  }

  protected _onAfterAddingFile(item: FileUploadItem): void {
    this.onAfterAddingFile(item);
  }

  protected _onAfterAddingAll(items: any): void {
    this.onAfterAddingAll(items);
  }

  protected _onBeforeUploadItem(item: FileUploadItem): void {
    item.onBeforeUpload();
    this.onBeforeUploadItem(item);
  }

  protected _onBuildItemForm(item: FileUploadItem, form: any): void {
    item.onBuildForm(form);
    this.onBuildItemForm(item, form);
  }

  protected _onProgressItem(item: FileUploadItem, progress: any): void {
    const total = this._getTotalProgress(progress);
    this.progress = total;
    item.onProgress(progress);
    this.onProgressItem(item, progress);
    this.onProgressAll(total);
    this._render();
  }

  protected _onSuccessItem(
    item: FileUploadItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    item.onSuccess(response, status, headers);
    this.onSuccessItem(item, response, status, headers);
  }

  protected _onCancelItem(
    item: FileUploadItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    item.onCancel(response, status, headers);
    this.onCancelItem(item, response, status, headers);
  }
}
