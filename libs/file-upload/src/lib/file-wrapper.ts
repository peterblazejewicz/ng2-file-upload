import { IFileWrapper } from './model/file-wrapper-interface';
import { isElement } from './utils/is-element';

export class FileWrapper implements IFileWrapper {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;

  constructor(fileOrInput: any) {
    const isInput = isElement(fileOrInput);
    const fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
    if (typeof fakePathOrObject === 'string') {
      this.createFromFakePath(fakePathOrObject);
    } else {
      this.createFromObject(fakePathOrObject);
    }
  }

  private createFromFakePath(path: string): void {
    this.lastModifiedDate = undefined;
    this.size = undefined;
    this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
    this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
  }

  private createFromObject(object: {
    size: number;
    type: string;
    name: string;
  }): void {
    this.size = object.size;
    this.type = object.type;
    this.name = object.name;
  }
}
