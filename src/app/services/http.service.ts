import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {forkJoin, from, merge, Observable, Subject} from "rxjs";
import {ICharacter} from "../entities/character.interface";
import {concatAll, concatMap, map, mergeAll, mergeMap} from "rxjs/internal/operators";

@Injectable()
export class HttpService {
  constructor(protected http: HttpClient) {}

  getCharacters(): Observable<ICharacter[]> {
    const url = `https://swapi.co/api/people/?page=`;
    return <Observable<ICharacter[]>> this.getAllPagesResult(url);
  }

  getMovies(): Observable<any[]> {
    const url = `https://swapi.co/api/films/?page=`;
    return this.getAllPagesResult(url);
  }

  getSpecies(): Observable<any[]> {
    const url = `https://swapi.co/api/species/?page=`;
    return this.getAllPagesResult(url);
  }

  getStarships(): Observable<any[]> {
    const url = `https://swapi.co/api/starships/?page=`;
    return this.getAllPagesResult(url);
  }

  private getAllPagesResult(url: string): Observable<any[]> {
    let resultEntities = [];
    let result: Subject<any[]> = new Subject<any[]>();

    this.http.get(url + 1).pipe(
      map(resp => [resp['results'], resp['count']]),
      concatMap(([entities, count]) => {
        resultEntities = resultEntities.concat(entities);
        if (resultEntities.length >= count) {
          result.next(resultEntities);
        }

        return from(this.generateNextPages(count, entities.length)).pipe(
          mergeMap(page => this.http.get(url + page).pipe(map(resp => [resp['results'], resp['count']])))
        );
      })
    ).subscribe(([entities, count]) => {
      resultEntities = resultEntities.concat(entities);

      // Add to next only when all entities arrived
      if (resultEntities.length >= count) {
        result.next(resultEntities);
      }
    });

    return result;
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
