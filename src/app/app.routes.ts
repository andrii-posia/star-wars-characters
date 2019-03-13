import {Routes} from "@angular/router";
import {CharacterListComponent} from "./components/character-list/character-list.component";
import {CharacterComponent} from "./components/character/character.component";

export const ROUTES:Routes = [
  {path: '', component: CharacterListComponent},
  {path: 'characters/:accessoryId', component: CharacterComponent },
  {path: '**', component: CharacterListComponent},
];
