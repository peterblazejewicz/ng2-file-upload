import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FileUploadModule } from '../file-upload.module';
import { FileUploader } from '../file-uploader';
import { FileDropDirective } from './file-drop.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'container',
  template: `
    <div type="file" ng2FileDrop [uploader]="uploader"></div>
  `
})
export class ContainerComponent {
  url = 'localhost:3000';
  uploader: FileUploader = new FileUploader({ url: this.url });
}

describe('Directive: FileDropDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let hostComponent: ContainerComponent;
  let directiveElement: DebugElement;
  let fileDropDirective: FileDropDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FileUploadModule],
      declarations: [ContainerComponent],
      providers: [ContainerComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerComponent);
    hostComponent = fixture.componentInstance;

    fixture.detectChanges();

    directiveElement = fixture.debugElement.query(
      By.directive(FileDropDirective)
    );
    fileDropDirective = directiveElement.injector.get(
      FileDropDirective
    ) as FileDropDirective;
  });

  it('can be initialized', () => {
    expect(fixture).toBeDefined();
    expect(hostComponent).toBeDefined();
    expect(fileDropDirective).toBeDefined();
  });

  it('can set file uploader', () => {
    expect(fileDropDirective.uploader).toBe(hostComponent.uploader);
  });

  it('can get uploader options', () => {
    // Check url set through binding
    expect(fileDropDirective.options.url).toBe(hostComponent.url);

    // Check default options
    expect(fileDropDirective.options.autoUpload).toBeFalsy();
    expect(fileDropDirective.options.isHtml5).toBeTruthy();
    expect(fileDropDirective.options.removeAfterUpload).toBeFalsy();
    expect(fileDropDirective.options.disableMultipart).toBeFalsy();
  });

  it('can get filters', () => {
    // TODO: Update test once implemented
    expect(fileDropDirective.filters).toEqual({});
  });

  it('handles drop event', () => {
    spyOn(fileDropDirective, 'onDrop');

    directiveElement.triggerEventHandler('drop', getFakeEventData());

    expect(fileDropDirective.onDrop).toHaveBeenCalled();
  });

  it('adds file to upload', () => {
    spyOn(fileDropDirective.uploader, 'addToQueue');

    let fileOverData;
    fileDropDirective.fileOver.subscribe((data: any) => (fileOverData = data));

    let fileDropData;
    fileDropDirective.fileDrop.subscribe(
      (data: File[]) => (fileDropData = data)
    );

    fileDropDirective.onDrop(getFakeEventData());

    const uploadedFiles = getFakeEventData().dataTransfer.files;
    const expectedArguments = [
      uploadedFiles,
      fileDropDirective.options,
      fileDropDirective.filters
    ];

    expect(fileDropDirective.uploader.addToQueue).toHaveBeenCalledWith(
      ...expectedArguments
    );
    expect(fileOverData).toBeFalsy();
    expect(fileDropData).toEqual(uploadedFiles);
  });

  it('handles dragover event', () => {
    spyOn(fileDropDirective, 'onDragOver');

    directiveElement.triggerEventHandler('dragover', getFakeEventData());

    expect(fileDropDirective.onDragOver).toHaveBeenCalled();
  });

  it('handles file over', () => {
    let fileOverData;
    fileDropDirective.fileOver.subscribe((data: any) => (fileOverData = data));

    fileDropDirective.onDragOver(getFakeEventData());

    expect(fileOverData).toBeTruthy();
  });

  it('handles dragleave event', () => {
    spyOn(fileDropDirective, 'onDragLeave');

    directiveElement.triggerEventHandler('dragleave', getFakeEventData());

    expect(fileDropDirective.onDragLeave).toHaveBeenCalled();
  });

  it('handles file over leave', () => {
    let fileOverData;
    fileDropDirective.fileOver.subscribe((data: any) => (fileOverData = data));

    fileDropDirective.onDragLeave(getFakeEventData());

    expect(fileOverData).toBeFalsy();
  });
});

function getFakeEventData(): any {
  return {
    dataTransfer: {
      files: ['foo.bar'],
      types: ['Files']
    },
    preventDefault: () => undefined,
    stopPropagation: () => undefined
  };
}
