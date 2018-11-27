import { FileUploadItem } from '../file-upload-item';
import { FileWrapper } from '../file-wrapper';
import { FileUploaderImpl } from '../implementation/file-uploader.impl';
import { CreateFileWrapper } from '../implementation/file-wrapper.impl';
import { FileUploaderOptions } from '../model/file-uploader-options';
import { ParsedResponseHeaders } from '../model/parsed-response-headers';

export class FileUploadItemImpl implements FileUploadItem {
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

  fileWrapper: FileWrapper;
  xhr: XMLHttpRequest;
  form: any;

  constructor(
    protected uploader: FileUploaderImpl,
    public file: File,
    protected options: FileUploaderOptions
  ) {
    this.fileWrapper = CreateFileWrapper(this.file);
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

  private onBeforeUploadInternal(): any {
    return undefined;
  }

  private onBuildFormInternal(form: any): any {
    return { form };
  }

  private onProgressInternal(progress: number): any {
    return { progress };
  }

  private onSuccessInternal(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { response, status, headers };
  }

  private onErrorInternal(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { response, status, headers };
  }

  private onCancelInternal(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { response, status, headers };
  }

  private onCompleteInternal(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): any {
    return { response, status, headers };
  }

  onBeforeUpload(): void {
    this.ready = true;
    this.uploading = true;
    this.uploaded = false;
    this.success = false;
    this.cancelled = false;
    this.error = false;
    this.progress = 0;
    this.onBeforeUploadInternal();
  }

  onBuildForm(form: any): void {
    this.onBuildFormInternal(form);
  }

  onProgress(progress: number): void {
    this.progress = progress;
    this.onProgressInternal(progress);
  }

  onSuccess(
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
    this.onSuccessInternal(response, status, headers);
  }

  onError(
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
    this.onErrorInternal(response, status, headers);
  }

  onCancel(
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
    this.onCancelInternal(response, status, headers);
  }

  onComplete(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void {
    this.onCompleteInternal(response, status, headers);

    if (this.uploader.options.removeAfterUpload) {
      this.remove();
    }
  }

  prepareToUploading(): void {
    this.index = this.index || ++this.uploader._nextIndex;
    this.ready = true;
  }
}
