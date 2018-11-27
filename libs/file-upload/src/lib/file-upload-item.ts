import { FileWrapper } from './file-wrapper';
import { ParsedResponseHeaders } from './model/parsed-response-headers';

export interface FileUploadItem {
  url: string;
  readonly file: File;

  readonly form: any;
  xhr: XMLHttpRequest;
  readonly cancelled: boolean;
  readonly error: boolean;
  readonly ready: boolean;
  readonly success: boolean;
  readonly uploaded: boolean;
  readonly uploading: boolean;

  readonly withCredentials: boolean;
  readonly headers: any[];
  readonly method: string;
  readonly alias: string;
  readonly fileWrapper: FileWrapper;

  cancel(): void;

  onBeforeUpload(): void;

  onBuildForm(form: any): void;

  onError(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void;
  onCancel(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void;

  onComplete(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void;

  onSuccess(
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ): void;

  onProgress(progress: number): void;

  prepareToUploading(): void;
  remove(): void;
  upload(): void;
}
