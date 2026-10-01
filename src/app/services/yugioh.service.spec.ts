import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { YuGiOhCard } from '../models/card.model';
import { YugiohService } from './yugioh.service';

describe('YugiohService', () => {
  let service: YugiohService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(YugiohService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends a fuzzy search with the required pagination parameters', () => {
    let cards: YuGiOhCard[] = [];
    service.searchCards('Blue-Eyes White Dragon').subscribe((result) => (cards = result));

    const request = http.expectOne((req) => req.url.endsWith('/cardinfo.php'));
    expect(request.request.params.get('fname')).toBe('Blue-Eyes White Dragon');
    expect(request.request.params.get('num')).toBe('30');
    expect(request.request.params.get('offset')).toBe('0');
    request.flush({ data: [{ id: 89631139, name: 'Blue-Eyes White Dragon' }] });

    expect(cards[0]?.name).toBe('Blue-Eyes White Dragon');
  });

  it('treats the API not-found response as an empty search result', () => {
    let cards: YuGiOhCard[] | undefined;
    service.searchCards('no-such-card').subscribe((result) => (cards = result));

    http.expectOne((req) => req.url.endsWith('/cardinfo.php')).flush(
      { error: 'No card matching your query was found.' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(cards).toEqual([]);
  });

  it('queries the Blue-Eyes archetype and exposes API failures to the caller', () => {
    let errorMessage = '';
    service.getBlueEyesCollection().subscribe({
      error: (error: Error) => (errorMessage = error.message),
    });

    const request = http.expectOne((req) => req.url.endsWith('/cardinfo.php'));
    expect(request.request.params.get('archetype')).toBe('Blue-Eyes');
    request.flush(
      { error: 'Unavailable' },
      { status: 503, statusText: 'Service Unavailable' },
    );

    expect(errorMessage).toContain('YGOPRODeck no pudo completar la consulta');
  });
});