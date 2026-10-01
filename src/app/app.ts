import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { YuGiOhCard } from './models/card.model';
import { BlueEyesComponent } from './components/blue-eyes/blue-eyes';
import { CardDetailComponent } from './components/card-detail/card-detail';
import { SearchComponent } from './components/search/search';

@Component({
  selector: 'app-root',
  imports: [BlueEyesComponent, CardDetailComponent, SearchComponent],
  templateUrl: './app-view.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly selectedCard = signal<YuGiOhCard | null>(null);
  readonly isDark = signal(true);

  constructor() {
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDark.update((isDark) => !isDark);
    this.applyTheme();
  }

  selectCard(card: YuGiOhCard): void {
    this.selectedCard.set(card);
  }

  private applyTheme(): void {
    const theme = this.isDark() ? 'dark' : 'light';
    document.documentElement.dataset['theme'] = theme;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', this.isDark() ? '#11191c' : '#efeee8');
  }
}
