import { VehicleClass } from "./vehicle-class";

export class VehicleClassData {

  // The API used didn't have an easy way to retrieve vehicle classification data
  // so they are hard-coded here
  static classes: VehicleClass[] = [
    {
      name: 'wheeled'
    },
    {
      name: 'repulsorcraft'
    },
    {
      name: 'starfighter'
    },
    {
      name: 'airspeeder'
    },
    {
      name: 'speeder'
    },
    {
      name: 'bomber'
    },
    {
      name: 'walker'
    },
    {
      name: 'barge'
    },
    {
      name: 'transport'
    },
    {
      name: 'tank'
    }
  ];

}
