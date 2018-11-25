import { IFileUploaderOptions } from './model/file-uploader-options';
import { ParsedResponseHeaders } from './model/parsed-response-headers';
import { IFileWrapper } from './model/file-wrapper-interface';
import { FileWrapper } from './file-wrapper';
import { FileUploader } from './file-uploader';
import { IFileUploadItem } from './model/file-upload-item-interface';

export class FileUploadItem implements IFileUploadItem {
  alias: string;
  url = '/';
  method: string;
  headers = [];
  withCredentials = true;

  ready = false;
  uploading = false;
  uploaded = false;
  success = false;
  cancelled = false;
  error = false;
  private progress = 0;
  private index = 0;

  fileWrapper: IFileWrapper;
  xhr: XMLHttpRequest;
  form: any;

  constructor(
    protected uploader: FileUploader,
    public file: File,
    protected options: IFileUploaderOptions
  ) {
    this.fileWrapper = new FileWrapper(this.file);
    if (uploader.options) {
      this.method = uploader.options.method || 'POST';
      this.alias = uploader.options.itemAlias || 'file';
    }
    this.url = uploader.options.url;
  }

  public upload() {
    try {
      this.uploader.uploadItem(this);
    } catch (e) {
      this.uploader._onCompleteItem(this, '', 0, {});
      this.uploader._onErrorItem(this, '', 0, {});
    }
  }

  public cancel() {
    this.uploader.cancelItem(this);
  }

  public remove() {
    this.uploader.removeFromQueue(this);
  }

  public onBeforeUpload(): any {
    return undefined;
  }

  public onBuildForm(form: any): any {
    return { form };
  }

  public onProgress(progress: number): any {
    return { progress };
  }

  public onSuccess(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { response, status, headers };
  }

  public onError(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { response, status, headers };
  }

  public onCancel(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { response, status, headers };
  }

  public onComplete(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { response, status, headers };
  }

  public _onBeforeUpload(): void {
    this.ready = true;
    this.uploading = true;
    this.uploaded = false;
    this.success = false;
    this.cancelled = false;
    this.error = false;
    this.progress = 0;
    this.onBeforeUpload();
  }

  public _onBuildForm(form: any): void {
    this.onBuildForm(form);
  }

  public _onProgress(progress: number): void {
    this.progress = progress;
    this.onProgress(progress);
  }

  public _onSuccess(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    this.ready = false;
    this.uploading = false;
    this.uploaded = true;
    this.success = true;
    this.cancelled = false;
    this.error = false;
    this.progress = 100;
    this.index = void 0;
    this.onSuccess(response, status, headers);
  }

  public _onError(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    this.ready = false;
    this.uploading = false;
    this.uploaded = true;
    this.success = false;
    this.cancelled = false;
    this.error = true;
    this.progress = 0;
    this.index = void 0;
    this.onError(response, status, headers);
  }

  public _onCancel(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    this.ready = false;
    this.uploading = false;
    this.uploaded = false;
    this.success = false;
    this.cancelled = true;
    this.error = false;
    this.progress = 0;
    this.index = void 0;
    this.onCancel(response, status, headers);
  }

  public _onComplete(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    this.onComplete(response, status, headers);

    if (this.uploader.options.removeAfterUpload) {
      this.remove();
    }
  }

  public _prepareToUploading(): void {
    this.index = this.index || ++this.uploader._nextIndex;
    this.ready = true;
  }
}
