import { Component } from '@angular/core';
import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { catchError, combineLatest, EMPTY, map, Subject, tap } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';
import { Vehicle } from '../vehicle';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'sw-vehicle-detail',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, DecimalPipe],
  templateUrl: './vehicle-detail.component.html'
})
export class VehicleDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  selectedVehicle$ = this.vehicleService.selectedVehicle$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  pageTitle$ = this.selectedVehicle$.pipe(
    map(vehicle => vehicle ? `Detail for: ${vehicle.name}` : null)
  )

  vehicleFilms$ = this.vehicleService.vehicleFilms$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  vm$ = combineLatest([
    this.selectedVehicle$,
    this.vehicleFilms$,
    this.pageTitle$
  ])
    .pipe(
      map(([vehicle, films, pageTitle]) =>
        ({ vehicle, films, pageTitle }))
    );

  constructor(private vehicleService: VehicleService,
    private cartService: CartService) { }

  addToCart(vehicle: Vehicle) {
    this.cartService.addToCart(vehicle);
  }
}
