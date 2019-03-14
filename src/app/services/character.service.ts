import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {ICharacter} from "../entities/character.interface";
import {BehaviorSubject, from} from "rxjs";
import { finalize } from 'rxjs/operators';
import {concatMap, mergeMap} from "rxjs/internal/operators";
import {IFilter} from "../entities/filter.interface";

@Injectable()
export class CharacterService {

  filteredCharacters: BehaviorSubject<ICharacter[]> = new BehaviorSubject([]);
  isCharactersLoaded: boolean;
  private characters: ICharacter[] = [];

  constructor(private httpService: HttpService) {
    this.initAllCharacters();
  }

  filterCharacters(filter: IFilter) {
    this.filteredCharacters.next(this.characters.filter((character) => {
      return this.isFilteredByFilm(character.films, filter.film)
          && this.isFilteredBySpecie(character.species, filter.specie)
          && this.isFilteredByStarship(character.starships, filter.starship);
    }));
  }

  getCharacterByName(name: string): ICharacter {
    return this.characters.find((character) => {
      return CharacterService.stringToSlug(character.name) === CharacterService.stringToSlug(name);
    });
  }

  // Convert to strict URL from string
  static stringToSlug(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;',
      to  = 'aaaaeeeeiiiioooouuuunc------';
    for (let i = 0, l = from.length ; i < l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  private isFilteredBySpecie(species: string[], filterSpecie: string) {
    return filterSpecie ? species.some((starship) => starship === filterSpecie) : true;
  }

  private isFilteredByStarship(starships: string[], filterStarship: string) {
    return filterStarship ? starships.some((starship) => starship === filterStarship) : true;
  }

  private isFilteredByFilm(films: string[], filterFilm: string) {
    return filterFilm ? films.some((film) => film === filterFilm) : true;
  }

  // Request first page, calculate number of pages and request others, add to characters
  private initAllCharacters() {
    this.httpService.getCharacters().pipe(
      concatMap(([characters, count]) => {
        this.addNewCharacters(characters);
        return from(this.generateNextPages(count, characters.length)).pipe(
          mergeMap(page => this.httpService.getCharacters(page))
        );
      }),
      finalize(() => {
        this.isCharactersLoaded = true;
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
