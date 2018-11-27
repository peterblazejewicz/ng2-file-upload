import { FileWrapper } from '../file-wrapper';
import { FileUploaderOptions } from '../file-uploader-options';

export interface FilterFunction {
  name: string;
  fn: (item?: FileWrapper, options?: FileUploaderOptions) => boolean;
}
