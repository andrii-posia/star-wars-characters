import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CharacterComponent } from './components/character/character.component';
import { FilterComponent } from './components/filter/filter.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { HttpService } from './services/http.service';
import { CharacterService } from './services/character.service';
import { HeaderComponent } from './components/header/header.component';
import {RouterModule} from "@angular/router";
import {ROUTES} from "./app.routes";

@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    FilterComponent,
    CharacterListComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, {useHash: false}),
  ],
  providers: [
    HttpService,
    CharacterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
