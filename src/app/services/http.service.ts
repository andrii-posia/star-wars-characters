import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {forkJoin, from, merge, Observable} from "rxjs";
import {ICharacter} from "../entities/character.interface";
import {concatAll, concatMap, map, mergeAll, mergeMap} from "rxjs/internal/operators";

@Injectable()
export class HttpService {
  constructor(protected http: HttpClient) {}

  getCharacters(page: number = 1): Observable<any[]> {
    const url = `https://swapi.co/api/people/?page=${page}`;
    return <Observable<any[]>> this.http.get(url).pipe(map(resp => [resp['results'], resp['count']]));
  }
}
