import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { EntryComponent } from './entry/entry.component';


const appRoutes: Routes = [
  // { path: 'heroes',     component: HeroListComponent }, // <-- delete this line
  { path: '',  component: EntryComponent },
  { path: '**', redirectTo: '', pathMatch: 'full'  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

