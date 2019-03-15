import { Pipe, PipeTransform } from '@angular/core';
import {AssistService} from "../services/assist.service";

@Pipe({name: 'spaceToDash'})
export class SpaceToDashPipe implements PipeTransform {
  transform(value: string): string {
    return AssistService.stringToSlug(value);
  }
}
