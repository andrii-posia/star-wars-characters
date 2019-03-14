import { Component, OnInit } from '@angular/core';
import {CharacterService} from "../../services/character.service";
import {IFilter} from "../../entities/filter.interface";
import {Observable} from "rxjs";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {map, startWith, debounceTime} from "rxjs/internal/operators";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  public filterForm: FormGroup;

  constructor(private characterService: CharacterService,
              private fb: FormBuilder) { }

  initFilterFrom() {
    this.filterForm = this.fb.group({
      movie: [''],
      spaceship: [''],
      specie: [''],
      fromYear: [''],
      toYear: [''],
    })
  }

  ngOnInit() {
    this.initFilterFrom();
    this.filteredOptions = this.filterForm.controls['movie'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.filteredOptions.pipe(debounceTime(1000)).subscribe((options) => {
      // options
      // const filter: IFilter = <IFilter> {
      //         film: "https://swapi.co/api/films/2/",
      //       };
      //       this.characterService.filterCharacters(filter);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  // ngOnInit() {
  //   timer(10000).subscribe(() => {
  //     const filter: IFilter = <IFilter> {
  //       film: "https://swapi.co/api/films/2/",
  //     };
  //     this.characterService.filterCharacters(filter);
  //   });
  // }

}
