import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { YuGiOhCard } from '../../models/card.model';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input({ required: true }) card!: YuGiOhCard;
  @Output() selected = new EventEmitter<YuGiOhCard>();

  get imageUrl(): string | undefined {
    const image = this.card.card_images?.[0];
    return image?.image_url_small ?? image?.image_url;
  }

  hideBrokenImage(event: Event): void {
    (event.currentTarget as HTMLImageElement).hidden = true;
  }
}