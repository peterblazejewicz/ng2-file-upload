import { FileUploaderOptions } from '../file-uploader-options';
import { FileWrapper } from '../file-wrapper';

export interface FileHeaders {
  name: string;
  value: string;
}

export interface FilterFunction {
  name: string;
  fn: (item?: FileWrapper, options?: FileUploaderOptions) => boolean;
}

export interface ParsedResponseHeaders {
  [headerFieldName: string]: string;
}


export type MutableRequired<T> = { -readonly [P in keyof T]: T[P] };
