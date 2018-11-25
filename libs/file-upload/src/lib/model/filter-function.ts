import { FileWrapper } from "../file-wrapper";
import { IFileUploaderOptions } from "./file-uploader-options";

export interface FilterFunction {
  name: string;
  fn: (item?: FileWrapper, options?: IFileUploaderOptions) => boolean;
}
