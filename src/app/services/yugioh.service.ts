import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { CardApiResponse, YuGiOhCard } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class YugiohService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

  searchCards(term: string): Observable<YuGiOhCard[]> {
    const params = new HttpParams().set('fname', term).set('num', '30').set('offset', '0');
    return this.fetchCards(params, true);
  }

  getBlueEyesCollection(): Observable<YuGiOhCard[]> {
    const params = new HttpParams().set('archetype', 'Blue-Eyes');
    return this.fetchCards(params);
  }

  private fetchCards(params: HttpParams, emptyOnNotFound = false): Observable<YuGiOhCard[]> {
    return this.http.get<CardApiResponse>(this.endpoint, { params }).pipe(
      map((response) => response.data ?? []),
      catchError((error: HttpErrorResponse) => {
        if (emptyOnNotFound && error.status === 400) {
          return of([]);
        }

        return throwError(
          () =>
            new Error(
              error.status === 0
                ? 'No se pudo conectar con YGOPRODeck. Comprueba tu conexión e inténtalo de nuevo.'
                : 'YGOPRODeck no pudo completar la consulta. Inténtalo de nuevo en unos segundos.',
            ),
        );
      }),
    );
  }
}