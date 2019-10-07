import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkatComponent } from './skat.component';

const skatRoutes: Routes = [
  {
    path: 'skat',
    children: [
      {
        path: '',
        component: SkatComponent
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
];

//taken from angular.io
//Only call RouterModule.forRoot in the root AppRoutingModule (or the AppModule if 
//that's where you register top level application routes). In any other module, you 
//must call the RouterModule.forChild method to register additional routes.

@NgModule({
  imports: [
    RouterModule.forChild(skatRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SkatRoutingModule { }