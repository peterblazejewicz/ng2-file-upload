import { FileHeaders, FilterFunction } from './core/interfaces';

export interface FileUploaderOptions {
  allowedMimeType?: string[];
  allowedFileType?: string[];
  autoUpload?: boolean;
  isHtml5?: boolean;
  filters?: FilterFunction[];
  headers?: FileHeaders[];
  method?: string;
  authToken?: string;
  maxFileSize?: number;
  queueLimit?: number;
  removeAfterUpload?: boolean;
  url?: string;
  disableMultipart?: boolean;
  itemAlias?: string;
  authTokenHeader?: string;
  additionalParameter?: { [key: string]: any };
  parametersBeforeFiles?: boolean;
  formatDataFunction?: Function;
  formatDataFunctionIsAsync?: boolean;
}
