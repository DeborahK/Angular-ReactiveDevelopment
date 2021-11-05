import { Observable, of } from "rxjs";
import { Vehicle } from "../vehicles/vehicle";

export interface Cart {
  cartItems: CartItem[]
}

export interface CartItem {
  vehicle: Vehicle;
  quantity: number;
}

// You could move this to a shared file
// and reuse it for every entity in the application
type ActionType = 'add' | 'update' | 'delete';

export interface Action<T> {
  item: T;
  action: ActionType;
}

// Test data for easier debugging
export const testCartItems$: Observable<CartItem[]> = of([
  {
    vehicle: {
      "name": "Vulture Droid",
      "model": "Vulture-class droid starfighter",
      "manufacturer": "Haor Chall Engineering, Baktoid Armor Workshop",
      "cost_in_credits": "100550",
      "crew": 0,
      "passengers": 0,
      "cargo_capacity": 0,
      "vehicle_class": "starfighter",
      "films": [
        "https://swapi.py4e.com/api/films/4/",
        "https://swapi.py4e.com/api/films/6/"
      ]
    },
    quantity: 2
  },
  {
    vehicle: {
      "name": "AT-AT",
      "model": "All Terrain Armored Transport",
      "manufacturer": "Kuat Drive Yards, Imperial Department of Military Research",
      "cost_in_credits": "200988",
      "crew": 5,
      "passengers": 40,
      "cargo_capacity": 1000,
      "vehicle_class": "assault walker",
      "films": [
        "https://swapi.py4e.com/api/films/2/",
        "https://swapi.py4e.com/api/films/3/"
      ]
    },
    quantity: 1,
  }
]);
