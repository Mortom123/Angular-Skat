import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkatComponent } from './skat.component';
import { SkatRoutingModule } from './skat-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SkatRoutingModule,
  ],
  declarations: [SkatComponent]
})
export class SkatModule { }
