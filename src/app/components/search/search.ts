import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, map, merge, of, startWith, switchMap } from 'rxjs';
import { YuGiOhCard } from '../../models/card.model';
import { YugiohService } from '../../services/yugioh.service';
import { CardComponent } from '../card/card';

interface SearchState {
  status: 'idle' | 'loading' | 'success' | 'empty' | 'error';
  cards: YuGiOhCard[];
  message?: string;
}

@Component({
  selector: 'app-search',
  imports: [AsyncPipe, ReactiveFormsModule, CardComponent],
  templateUrl: './search.html',
  styleUrl: './search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly yugioh = inject(YugiohService);
  private readonly retryQuery = new Subject<string>();

  @Output() cardSelected = new EventEmitter<YuGiOhCard>();

  readonly searchControl = new FormControl('Blue-Eyes White Dragon', { nonNullable: true });
  readonly suggestions = ['Blue-Eyes', 'Dark Magician', 'Kuriboh'];
  readonly state$: Observable<SearchState> = merge(
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      map((value) => value.trim()),
      debounceTime(350),
      distinctUntilChanged(),
    ),
    this.retryQuery,
  ).pipe(
    switchMap((query) => {
      if (query.length < 2) {
        return of<SearchState>({ status: 'idle', cards: [] });
      }

      return this.yugioh.searchCards(query).pipe(
        map((cards): SearchState => ({ status: cards.length ? 'success' : 'empty', cards })),
        startWith<SearchState>({ status: 'loading', cards: [] }),
        catchError((error: Error) =>
          of<SearchState>({ status: 'error', cards: [], message: error.message }),
        ),
      );
    }),
  );

  searchFor(term: string): void {
    this.searchControl.setValue(term);
  }

  retry(): void {
    this.retryQuery.next(this.searchControl.value.trim());
  }
}