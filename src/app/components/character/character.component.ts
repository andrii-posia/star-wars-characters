import { Component, OnInit } from '@angular/core';
import {CharacterService} from "../../services/character.service";
import {ICharacter} from "../../entities/character.interface";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

  character: ICharacter;

  constructor(private characterService: CharacterService,
              private activate: ActivatedRoute) {

    activate.params.subscribe(({characterName}) => {
      this.character = this.characterService.getCharacterByName(characterName);
    });
  }

  ngOnInit() {
  }

}
