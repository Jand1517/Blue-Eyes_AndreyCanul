import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { CardSet, YuGiOhCard } from '../../models/card.model';
import { YugiohService } from '../../services/yugioh.service';
import { CardComponent } from '../card/card';

interface CollectionState {
  status: 'loading' | 'success' | 'empty' | 'error';
  cards: YuGiOhCard[];
  message?: string;
}

@Component({
  selector: 'app-blue-eyes',
  imports: [CardComponent],
  templateUrl: './blue-eyes.html',
  styleUrl: './blue-eyes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlueEyesComponent implements OnInit {
  private readonly yugioh = inject(YugiohService);

  @Output() cardSelected = new EventEmitter<YuGiOhCard>();

  readonly state = signal<CollectionState>({ status: 'loading', cards: [] });
  readonly selectedExpansion = signal('');
  readonly expansions = computed(() => {
    const names = new Set<string>();
    for (const card of this.state().cards) {
      for (const printing of card.card_sets ?? []) {
        if (printing.set_name) names.add(printing.set_name);
      }
    }
    return [...names].sort((first, second) => first.localeCompare(second));
  });
  readonly visibleCards = computed(() => {
    const expansion = this.selectedExpansion();
    if (!expansion) return this.state().cards;

    return this.state().cards.filter((card) =>
      (card.card_sets ?? []).some((printing: CardSet) => printing.set_name === expansion),
    );
  });

  ngOnInit(): void {
    this.loadCollection();
  }

  loadCollection(): void {
    this.state.set({ status: 'loading', cards: [] });
    this.yugioh.getBlueEyesCollection().subscribe({
      next: (cards) => {
        const collection = cards.filter((card) => card.archetype?.toLowerCase() === 'blue-eyes');
        this.state.set({ status: collection.length ? 'success' : 'empty', cards: collection });
      },
      error: (error: Error) => this.state.set({ status: 'error', cards: [], message: error.message }),
    });
  }

  changeExpansion(event: Event): void {
    this.selectedExpansion.set((event.currentTarget as HTMLSelectElement).value);
  }
}