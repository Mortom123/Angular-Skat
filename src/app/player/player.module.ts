import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerOverviewComponent } from './player-overview/player-overview.component';
import { PlayerCreationComponent } from './player-creation/player-creation.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  imports: [
    CommonModule,
    PlayerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  declarations: [PlayerOverviewComponent, PlayerCreationComponent]
})
export class PlayerModule { }
