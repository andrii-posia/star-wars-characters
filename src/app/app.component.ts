import { Component } from '@angular/core';
import {CharacterService} from "./services/character.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public characterService: CharacterService) {}
}
