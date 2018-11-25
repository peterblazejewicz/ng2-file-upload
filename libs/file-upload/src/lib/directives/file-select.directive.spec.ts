import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FileSelectDirective } from './file-select.directive';
import { FileUploadModule } from '../file-upload.module';
import { FileUploader } from '../file-uploader';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'container',
  template: `
    <input type="file" ng2FileSelect [uploader]="uploader" />
  `
})
export class ContainerComponent {
  url = 'localhost:3000';
  uploader: FileUploader = new FileUploader({ url: this.url });
}

describe('Directive: FileSelectDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let hostComponent: ContainerComponent;
  let directiveElement: DebugElement;
  let fileSelectDirective: FileSelectDirective;

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
      By.directive(FileSelectDirective)
    );
    fileSelectDirective = directiveElement.injector.get(
      FileSelectDirective
    ) as FileSelectDirective;
  });

  it('can be initialized', () => {
    expect(fixture).toBeDefined();
    expect(hostComponent).toBeDefined();
    expect(fileSelectDirective).toBeDefined();
  });

  it('can set file uploader', () => {
    expect(fileSelectDirective.uploader).toBe(hostComponent.uploader);
  });

  it('can get uploader options', () => {

    // Check url set through binding
    expect(fileSelectDirective.options.url).toBe(hostComponent.url);

    // Check default options
    expect(fileSelectDirective.options.autoUpload).toBeFalsy();
    expect(fileSelectDirective.options.isHtml5).toBeTruthy();
    expect(fileSelectDirective.options.removeAfterUpload).toBeFalsy();
    expect(fileSelectDirective.options.disableMultipart).toBeFalsy();
  });

  it('can get filters', () => {
    // TODO: Update test once implemented
    expect(fileSelectDirective.filters).toEqual({});
  });

  it('can check if element is empty', () => {
    const isElementEmpty = fileSelectDirective.isEmptyAfterSelection;

    expect(isElementEmpty).toBeFalsy();
  });

  it('can listed on change event', () => {
    spyOn(fileSelectDirective, 'onChange');

    directiveElement.triggerEventHandler('change', {});

    expect(fileSelectDirective.onChange).toHaveBeenCalled();
  });

  it('handles change event', () => {
    spyOn(fileSelectDirective.uploader, 'addToQueue');

    fileSelectDirective.onChange();

    const expectedArguments = [
      directiveElement.nativeElement.files,
      fileSelectDirective.options,
      fileSelectDirective.filters,
    ];
    expect(fileSelectDirective.uploader.addToQueue).toHaveBeenCalledWith(
      ...expectedArguments
    );
  });
});
