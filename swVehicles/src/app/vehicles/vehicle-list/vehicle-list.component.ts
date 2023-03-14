import { Component } from '@angular/core';
import { NgFor, NgClass, NgIf, AsyncPipe } from '@angular/common';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VehicleClassService } from '../vehicle-classes/vehicle-class.service';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'sw-vehicle-list',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgFor, NgIf],
  templateUrl: './vehicle-list.component.html'
})
export class VehicleListComponent {
  pageTitle = 'Vehicles';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // Categories for drop down list
  vehicleClasses$ = this.vehicleClassService.vehicleClassifications$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }));

  // Vehicles filtered by the selected classification
  vehicles$ = this.vehicleService.vehicles$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      }));

  selectedVehicle$ = this.vehicleService.selectedVehicle$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  vehicleFilms$ = this.vehicleService.vehicleFilms$.pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  // Make it easier to work with the result in the UI
  vm$ = combineLatest([this.vehicles$, this.selectedVehicle$, this.vehicleClasses$]).pipe(
    map(([vehicles, selectedVehicle, vehicleClasses]) => ({
      vehicles,
      selectedVehicle,
      vehicleClasses
    }))
  );

  constructor(private vehicleService: VehicleService, private vehicleClassService: VehicleClassService) { }

  // When a vehicle is selected, emit the selected vehicle name
  onSelected(vehicleName: string): void {
    this.vehicleService.vehicleSelected(vehicleName);
  }

  // When a vehicle classification is selected,
  // emit the selected vehicle class
  onVehicleClassSelected(vehicleClass: string): void {
    this.vehicleService.vehicleClassSelected(vehicleClass);
  }

}
