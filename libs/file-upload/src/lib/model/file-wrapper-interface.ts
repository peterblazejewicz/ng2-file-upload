export interface IFileWrapper {
  readonly lastModified: number;
  readonly lastModifiedDate: Date;
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly webkitRelativePath: string;
}
