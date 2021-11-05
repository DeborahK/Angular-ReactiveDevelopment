import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleShellComponent } from './vehicle-shell/vehicle-shell.component';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';

@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleDetailComponent,
    VehicleShellComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: VehicleShellComponent
      }
    ])
  ]
})
export class VehicleModule { }
