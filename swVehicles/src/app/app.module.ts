import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PageNotFoundComponent } from './page-not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { CartShellComponent } from './cart/cart-shell/cart-shell.component';
import { CartListComponent } from './cart/cart-list/cart-list.component';
import { CartTotalComponent } from './cart/cart-total/cart-total.component';
import { CartItemComponent } from './cart/cart-item/cart-item.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      {
        path: 'vehicles',
        loadChildren: () =>
          import('./vehicles/vehicle.module').then(m => m.VehicleModule)
      },
      {
        path: 'cart',
        component: CartShellComponent
      },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ])
  ],
  declarations: [
    AppComponent,
    WelcomeComponent,
    CartShellComponent,
    CartListComponent,
    CartTotalComponent,
    CartItemComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
