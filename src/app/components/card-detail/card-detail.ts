import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardSet, YuGiOhCard } from '../../models/card.model';

@Component({
  selector: 'app-card-detail',
  imports: [],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDetailComponent {
  @Input() card: YuGiOhCard | null = null;

  get imageUrl(): string | undefined {
    const image = this.card?.card_images?.[0];
    return image?.image_url ?? image?.image_url_small;
  }

  get printings(): CardSet[] {
    return this.card?.card_sets ?? [];
  }

  get isBlueEyes(): boolean {
    return this.card?.archetype?.toLowerCase() === 'blue-eyes';
  }
}