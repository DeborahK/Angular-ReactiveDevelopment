import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  expand,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  reduce,
  shareReplay,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import { Film, Vehicle, VehicleResponse } from './vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private url = 'https://swapi.py4e.com/api/vehicles';

  private vehicleSubject = new BehaviorSubject<string>('');
  vehicleSelected$ = this.vehicleSubject.asObservable();

  // Action stream
  private vehicleClassSubject = new BehaviorSubject<string>('');
  vehicleClassAction$ = this.vehicleClassSubject.asObservable();

  // All pages of vehicles
  allVehicles$ = this.http.get<VehicleResponse>(this.url).pipe(
    expand(data => data.next ? this.http.get<VehicleResponse>(data.next) : EMPTY),
    reduce((acc, data) => acc.concat(data.results), [] as Vehicle[]),
    // tap(data => console.log(data))
  );

  // Vehicles filtered by the selected classification
  // NOTE: This particular API does not provide a feature to search by vehicle class
  // Rather, the code gets all vehicles, and filters by the class.
  vehicles$ = combineLatest([
    this.allVehicles$,
    this.vehicleClassAction$.pipe(
      // When the classification changes, clear the selected vehicle
      tap(() => this.vehicleSelected(''))
    )
  ])
    .pipe(
      map(([vehicles, selectedVehicleClass]) =>
        vehicles.filter(product =>
          selectedVehicleClass ? product.vehicle_class.toLocaleLowerCase().includes(selectedVehicleClass.toLocaleLowerCase()) : true
        )),
      catchError(this.handleError)
    );

  // First page of vehicles
  firstPageVehicles$ = this.http.get<VehicleResponse>(this.url).pipe(
    tap(data => console.log(data)),
    map(data => data.results),
    catchError(this.handleError)
  );

  selectedVehicle$ = this.vehicleSelected$.pipe(
    switchMap(vehicleName =>
      vehicleName.length ?
        this.http.get<VehicleResponse>(`${this.url}?search=${vehicleName}`).pipe(
          map(data => data.results[0]),
          // Fill in a random price for any missing the price
          // (We can't modify the backend in this demo)
          map(v => ({
            ...v,
            cost_in_credits: isNaN(Number(v.cost_in_credits)) ? String(Math.random()*100000) : v.cost_in_credits
          }) as Vehicle),
          catchError(this.handleError)
        ) : of(null)
    ),
    shareReplay(1),
  );

  vehicleFilms$ = this.selectedVehicle$.pipe(
    filter(Boolean),
    switchMap(vehicle =>
      forkJoin(vehicle.films.map(link => this.http.get<Film>(link)))
    )
  );

  constructor(private http: HttpClient) { }

  vehicleSelected(vehicleName: string) {
    this.vehicleSubject.next(vehicleName);
  }

  // When a vehicle classification is selected,
  // emit the selected vehicle class
  vehicleClassSelected(vehicleClass: any): void {
    this.vehicleClassSubject.next(vehicleClass);
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message
        }`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
