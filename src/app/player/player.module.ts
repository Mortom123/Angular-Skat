import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerOverviewComponent } from './player-overview/player-overview.component';
import { PlayerCreationComponent } from './player-creation/player-creation.component';

@NgModule({
  imports: [
    CommonModule,
    PlayerRoutingModule
  ],
  declarations: [PlayerOverviewComponent, PlayerCreationComponent]
})
export class PlayerModule { }
