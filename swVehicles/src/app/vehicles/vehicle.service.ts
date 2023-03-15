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
  mergeMap,
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

  // Action stream
  private vehicleSelectedSubject = new BehaviorSubject<string>('');
  vehicleSelected$ = this.vehicleSelectedSubject.asObservable();

  // Action stream
  private vehicleClassSubject = new BehaviorSubject<string>('');
  vehicleClassSelected$ = this.vehicleClassSubject.asObservable();

  // All pages of vehicles
  allVehicles$ = this.http.get<VehicleResponse>(this.url).pipe(
    expand(data => data.next ? this.http.get<VehicleResponse>(data.next) : EMPTY),
    reduce((acc, data) => acc.concat(data.results), [] as Vehicle[])
  );

  // One page of vehicles with their films
  // Not currently used in the app
  // To try it out, subscribe in the constructor below.
  vehiclesWithFilms$ = this.http.get<VehicleResponse>(this.url).pipe(
    map(data => data.results as Vehicle[]),
    mergeMap(vehicles => forkJoin(vehicles.map(vehicle => 
      forkJoin(vehicle.films.map(film => this.http.get<Film>(film).pipe(
        map(f => f.title),
      ))).pipe(
        map(films => ({ ...vehicle, films } as Vehicle))
      ),
    )))
  );

  // Vehicles filtered by the selected classification
  // NOTE: This particular API does not provide a feature to search by vehicle class
  // Rather, the code gets all vehicles, and filters by the class.
  vehicles$ = combineLatest([
    this.allVehicles$,
    this.vehicleClassSelected$.pipe(
      // When the classification changes, clear the selected vehicle
      tap(() => this.vehicleSelected(''))
    )
  ])
    .pipe(
      map(([vehicles, selectedVehicleClass]) =>
        vehicles.filter(v =>
          selectedVehicleClass ? v.vehicle_class.toLocaleLowerCase().includes(selectedVehicleClass.toLocaleLowerCase()) : true
        )),
      catchError(this.handleError)
    );

  // First page of vehicles
  firstPageVehicles$ = this.http.get<VehicleResponse>(this.url).pipe(
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
            cost_in_credits: isNaN(Number(v.cost_in_credits)) ? String(Math.random() * 100000) : v.cost_in_credits
          }) as Vehicle),
          catchError(this.handleError)
        ) : of(null)
    ),
    shareReplay(1),
  );

  vehicleFilms$ = this.selectedVehicle$.pipe(
    filter(Boolean),
    switchMap(vehicle =>
      forkJoin(vehicle.films.map(link => 
        this.http.get<Film>(link)))
    )
  );
 
  constructor(private http: HttpClient) { 
  }

  vehicleSelected(vehicleName: string) {
    this.vehicleSelectedSubject.next(vehicleName);
  }

  // When a vehicle classification is selected,
  // emit the selected vehicle class
  vehicleClassSelected(vehicleClass: string): void {
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
    return throwError(() => errorMessage);
  }
}
