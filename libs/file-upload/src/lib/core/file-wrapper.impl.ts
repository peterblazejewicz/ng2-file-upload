import { FileWrapper } from '../file-wrapper';
import { isElement } from '../utils/is-element';
import { MutableRequired } from './interfaces';

class FileWrapperImpl extends FileWrapper {}
export function CreateFileWrapper(fileOrInput: any) {
  const fakePathOrObject = isElement(fileOrInput)
    ? fileOrInput.value
    : fileOrInput;
  const wrapper: MutableRequired<FileWrapper> = new FileWrapperImpl();
  if (typeof fakePathOrObject === 'string') {
    wrapper.size = undefined;
    wrapper.type =
      'like/' +
      fakePathOrObject
        .slice(fakePathOrObject.lastIndexOf('.') + 1)
        .toLowerCase();
    wrapper.name = fakePathOrObject.slice(
      fakePathOrObject.lastIndexOf('/') + fakePathOrObject.lastIndexOf('\\') + 2
    );
  } else {
    wrapper.size = fakePathOrObject.size;
    wrapper.type = fakePathOrObject.type;
    wrapper.name = fakePathOrObject.name;
  }
  return wrapper;
}
