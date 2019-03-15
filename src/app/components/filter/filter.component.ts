import { Component, OnInit } from '@angular/core';
import {CharacterService} from "../../services/character.service";
import {IFilter} from "../../entities/filter.interface";
import {combineLatest, Observable} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {map, startWith, debounceTime} from "rxjs/internal/operators";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  options: any;
  filteredOptions: Map<string, Observable<string[]>> = new Map<string, Observable<string[]>>();

  public filterForm: FormGroup;

  constructor(private characterService: CharacterService,
              private fb: FormBuilder) {
    this.characterService.resetFilteredCharacters();

    this.options = {
      'movies' : Array.from(this.characterService.optionsMap.get('movies').values()),
      'species' : Array.from(this.characterService.optionsMap.get('species').values()),
      'starships' : Array.from(this.characterService.optionsMap.get('starships').values()),
    };
  }

  initFilterFrom() {
    this.filterForm = this.fb.group({
      movie: [''],
      spaceship: [''],
      specie: [''],
      fromYear: [''],
      fromYearBB: ['BBY'],
      toYear: [''],
      toYearBB: ['ABY'],
    })
  }

  ngOnInit() {
    this.initFilterFrom();
    this.filteredOptions.set('movies', this.filterForm.controls['movie'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 'movies'))
      )
    );
    this.filteredOptions.set('species', this.filterForm.controls['specie'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 'species'))
      )
    );
    this.filteredOptions.set('starships', this.filterForm.controls['spaceship'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, 'starships'))
      )
    );

    // Init filter search
    this.subscribeToChangeValuesAndSearch(this.filterForm.controls['spaceship'].valueChanges);
    this.subscribeToChangeValuesAndSearch(this.filterForm.controls['specie'].valueChanges);
    this.subscribeToChangeValuesAndSearch(this.filterForm.controls['movie'].valueChanges);
    this.subscribeToChangeValuesAndSearch(this.filterForm.controls['fromYear'].valueChanges);
    this.subscribeToChangeValuesAndSearch(this.filterForm.controls['fromYearBB'].valueChanges);
    this.subscribeToChangeValuesAndSearch(this.filterForm.controls['toYear'].valueChanges);
    this.subscribeToChangeValuesAndSearch(this.filterForm.controls['toYearBB'].valueChanges);
  }

  private subscribeToChangeValuesAndSearch(obs: Observable<any>) {
    obs.pipe(debounceTime(1000)).subscribe(() => {
      const filter: IFilter = <IFilter> {
        birthYearFrom: this.filterForm.controls['fromYear'].value + this.filterForm.controls['fromYearBB'].value,
        birthYearTo: this.filterForm.controls['toYear'].value + this.filterForm.controls['toYearBB'].value,
        specie: this.filterForm.controls['specie'].value,
        starship: this.filterForm.controls['spaceship'].value,
        film: this.filterForm.controls['movie'].value,
      };

      this.characterService.filterCharacters(filter);
    });
  }

  private _filter(value: string, type: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options[type].filter(option => option.toLowerCase().includes(filterValue));
  }
}
