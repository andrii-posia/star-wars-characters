import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {forkJoin, from, merge, Observable} from "rxjs";
import {ICharacter} from "../entities/character.interface";
import {concatAll, concatMap, map, mergeAll, mergeMap} from "rxjs/internal/operators";

@Injectable()
export class AssistService {
  constructor() {}

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
}
