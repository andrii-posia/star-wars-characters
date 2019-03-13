import { Component, OnInit } from '@angular/core';
import {ICharacter} from "../../entities/character.interface";
import {CharacterService} from "../../services/character.service";

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {

  constructor(public characterService: CharacterService) { }

  ngOnInit() {
  }

}
