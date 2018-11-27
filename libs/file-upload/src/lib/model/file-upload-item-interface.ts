import { FileWrapper } from "../file-wrapper";

export interface IFileUploadItem {
  url: string;
  readonly file: File;

  readonly form: any;
  readonly xhr: XMLHttpRequest;
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
  _prepareToUploading(): void;
  remove(): void;
  upload(): void;
}
