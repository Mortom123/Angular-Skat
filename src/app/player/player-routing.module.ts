import { PlayerCreationComponent } from './player-creation/player-creation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerOverviewComponent } from './player-overview/player-overview.component';

const routes: Routes = [{
  path: "player",
  children: [
    {
      path: 'add',
      component: PlayerCreationComponent
    },
    {
      path: '',
      component: PlayerOverviewComponent
    },
    {
      path: '**',
      redirectTo: '',
      pathMatch: 'full'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
