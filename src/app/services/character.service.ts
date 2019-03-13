import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {ICharacter} from "../entities/character.interface";
import {BehaviorSubject, from} from "rxjs";
import {concatMap, mergeMap} from "rxjs/internal/operators";
import {IFilter} from "../entities/filter.interface";

@Injectable()
export class CharacterService {

  filteredCharacters: BehaviorSubject<ICharacter[]> = new BehaviorSubject([]);
  private characters: ICharacter[] = [];

  constructor(private httpService: HttpService) {
    this.initAllCharacters();
  }

  // Request first page, calculate number of pages and request others, add to characters
  private initAllCharacters() {
    this.httpService.getCharacters().pipe(
      concatMap(([characters, count]) => {
        this.addNewCharacters(characters);
        return from(this.generateNextPages(count, characters.length)).pipe(
          mergeMap(page => this.httpService.getCharacters(page))
        );
      })
    ).subscribe(([characters, count]) => {
      this.addNewCharacters(characters);

      // Add to filtered only when all characters arrived
      if (this.characters.length >= count) {
        this.filteredCharacters.next(this.characters);
      }
    });
  }

  private addNewCharacters(characters: ICharacter[]): void {
    this.characters = this.characters.concat(characters);
  }

  //Generate Array of Pages From
  private generateNextPages(numberOfCharacters: number, numberPerPage: number, fromPage: number = 2): number[] {
    const numberOfPages = Math.ceil(numberOfCharacters / numberPerPage);
    let pages: number[] = [];

    for (let i = fromPage; i <= numberOfPages; i++) {
      pages.push(i);
    }

    return pages;
  }
}
