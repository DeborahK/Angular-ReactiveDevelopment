import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { throwError, Observable, shareReplay, of, map } from 'rxjs';
import { VehicleClassData } from './vehicle-class-data';

@Injectable({
  providedIn: 'root'
})
export class VehicleClassService {

  // All vehicle classifications
  // Sort on the name
  vehicleClassifications$ = of(VehicleClassData.classes).pipe(
    map(classes => classes.sort((a, b) => a.name.localeCompare(b.name))),
    shareReplay(1)
  );

  constructor(private http: HttpClient) { }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(() => new Error(errorMessage));
  }
}
