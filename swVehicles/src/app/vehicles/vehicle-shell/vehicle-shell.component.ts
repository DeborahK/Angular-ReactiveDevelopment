import { Component } from '@angular/core';

@Component({
  template: `
  <div class='row'>
    <div class='col-md-4'>
        <sw-vehicle-list></sw-vehicle-list>
    </div>
    <div class='col-md-8'>
        <sw-vehicle-detail></sw-vehicle-detail>
    </div>
</div>
  `
})
export class VehicleShellComponent {

  constructor() { }

}
