import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/modules/shared/components/header/header.component';
import { RouterModule } from '@angular/router';

const components = [HeaderComponent];
const modules = [CommonModule, RouterModule];

@NgModule({
  declarations: [
    components
  ],
  imports: [
    modules
  ],
  exports: [components, modules]
})
export class SharedModule { }
