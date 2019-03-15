import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {ICharacter} from "../entities/character.interface";
import {BehaviorSubject, from} from "rxjs";
import {IFilter} from "../entities/filter.interface";
import {AssistService} from "./assist.service";

@Injectable()
export class CharacterService {

  filteredCharacters: BehaviorSubject<ICharacter[]> = new BehaviorSubject([]);
  private isDataLoadedMap: Map<string, boolean> = new Map<string, boolean>();
  private characters: ICharacter[] = [];

  optionsMap: Map<string, Map<string, string>> = new Map<string, Map<string, string>>();

  constructor(private httpService: HttpService) {
    this.isDataLoadedMap.set('movies', false);
    this.isDataLoadedMap.set('species', false);
    this.isDataLoadedMap.set('spaceships', false);
    this.isDataLoadedMap.set('characters', false);



    this.initAllCharacters();
    this.initMovies();
    this.initSpecie();
    this.initStarships();
  }

  get isAllDataLoaded() {
    return Array.from(this.isDataLoadedMap.values()).every((value) => {
      return value;
    });
  }

  resetFilteredCharacters() {
    this.filteredCharacters.next(this.characters);
  }

  filterCharacters(filter: IFilter) {
    this.filteredCharacters.next(this.characters.filter((character) => {
      return this.isFilteredByFilm(character.films, filter.film)
          && this.isFilteredBySpecie(character.species, filter.specie)
          && this.isFilteredByYear(character.birth_year, filter)
          && this.isFilteredByStarship(character.starships, filter.starship);
    }));
  }

  getCharacterByName(name: string): ICharacter {
    return this.characters.find((character) => {
      return AssistService.stringToSlug(character.name) === AssistService.stringToSlug(name);
    });
  }

  private isFilteredByYear(birthYearBB: string, filter: IFilter) {
    const birthYear = this.getRealYear(birthYearBB);
    const fromYear = this.getRealYear(filter.birthYearFrom);
    const toYear = this.getRealYear(filter.birthYearTo);

    // if fromYear and toYear empty
    if (fromYear === undefined && toYear === undefined) return true;

    if (birthYear === undefined) return false;

    if (fromYear  !== undefined && toYear === undefined) {
      return fromYear <= birthYear;
    }

    if (fromYear === undefined && toYear !== undefined) {
      return birthYear <= toYear;
    }

    return fromYear <= birthYear && birthYear <= toYear;
  }

  private getRealYear(yearBB: string) {
    const yearArr = yearBB.split(/ABY|BBY/),
      year = yearArr.length > 1 && yearArr[0].length > 0 ? yearArr[0] : undefined;

    if (year === undefined || year == 'null' ) return undefined;

    return Number(yearBB.search(/ABY/) > -1 ? year : -year);
  }

  private isFilteredBySpecie(species: string[], filterSpecie: string) {
    return filterSpecie ? species.some((specie) => this.optionsMap.get('species').get(specie) === filterSpecie) : true;
  }

  private isFilteredByStarship(starships: string[], filterStarship: string) {
    return filterStarship ? starships.some((starship) => this.optionsMap.get('starships').get(starship) === filterStarship) : true;
  }

  private isFilteredByFilm(films: string[], filterFilm: string) {
    return filterFilm ? films.some((film) => this.optionsMap.get('movies').get(film) === filterFilm) : true;
  }

  initMovies() {
    this.httpService.getMovies().subscribe((movies) => {
      const films = new Map<string, string>();
      this.optionsMap.set('movies', films);

      movies.forEach((movie) => {
        films.set(movie.url, movie.title);
        this.isDataLoadedMap.set('movies', true);
      });
    });
  }

  initSpecie() {
    this.httpService.getSpecies().subscribe((species) => {
      const spec = new Map<string, string>();
      this.optionsMap.set('species', spec);

      species.forEach((specie) => {
        spec.set(specie.url, specie.name);
        this.isDataLoadedMap.set('species', true);
      });
    });
  }

  initStarships() {
    this.httpService.getStarships().subscribe((starships) => {
      const ships = new Map<string, string>();
      this.optionsMap.set('starships', ships);

      starships.forEach((starships) => {
        ships.set(starships.url, starships.name);
        this.isDataLoadedMap.set('spaceships', true);
      });
    });
  }

  private initAllCharacters() {
    this.httpService.getCharacters().subscribe((characters) => {
      this.characters = this.characters.concat(characters);
      this.filteredCharacters.next(this.characters);
      this.isDataLoadedMap.set('characters', true);
    });
  }
}
