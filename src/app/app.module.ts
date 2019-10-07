import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import { EntryComponent } from './entry/entry.component';
import { SkatModule } from './skat/skat.module';
import { ParticlesModule } from 'angular-particle';
import { FlexLayoutModule} from '@angular/flex-layout'
import { PlayerModule } from './player/player.module';


@NgModule({
   declarations: [
      AppComponent,
      HeaderbarComponent,
      EntryComponent,
   ],
   imports: [
      BrowserModule,
      MaterialModule,
      FlexLayoutModule,
      SkatModule,
      ParticlesModule,
      PlayerModule,
      AppRoutingModule,
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
