function isElement(node: any): boolean {
  return !!(node && (node.nodeName || (node.prop && node.attr && node.find)));
}

export class FileWrapper {
  lastModifiedDate: any;
  size: any;
  type: string;
  name: string;
  rawFile: string;

  constructor(fileOrInput: any) {
    this.rawFile = fileOrInput;
    const isInput = isElement(fileOrInput);
    const fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
    if(typeof fakePathOrObject === 'string') {
      this._createFromFakePath(fakePathOrObject);
    } else {
      this._createFromObject(fakePathOrObject);
    }
  }

  _createFromFakePath(path: string): void {
    this.lastModifiedDate = undefined;
    this.size = undefined;
    this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
    this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
  }
  _createFromObject(object: {
    size: number;
    type: string;
    name: string;
  }): void {
    this.size = object.size;
    this.type = object.type;
    this.name = object.name;
  }
}
