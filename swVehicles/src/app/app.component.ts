import { Component } from '@angular/core';
import { map } from 'rxjs';

import { CartService } from './cart/cart.service';

@Component({
  selector: 'sw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'Star Wars Vehicle Sales';

  cartCount$ = this.cartService.cartItems$.pipe(
    map(items => items.length)
  );

  constructor(private cartService: CartService) {}
}
