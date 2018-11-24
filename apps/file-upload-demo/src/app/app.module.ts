import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FileUploadModule } from '@ng2/file-upload';
import { NxModule } from '@nrwl/nx';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { AppComponent } from './app.component';
import { FileUploadSectionComponent } from './file-upload-section/file-upload-section.component';
import { SimpleDemoComponent } from './simple-demo/simple-demo.component';

@NgModule({
  declarations: [AppComponent, FileUploadSectionComponent, SimpleDemoComponent],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    FileUploadModule,
    TabsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
