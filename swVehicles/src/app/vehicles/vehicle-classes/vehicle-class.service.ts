import { Injectable } from '@angular/core';

import { shareReplay, of, map } from 'rxjs';
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

}
