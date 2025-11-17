import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Landing } from './pages/home/landing/landing';
import { Collections } from './pages/home/collections/collections';
// import { Admin } from './pages/admin/admin';
// import { Dashboard } from './pages/admin/dashboard/dashboard';
// import { Auth } from './pages/auth/auth';
// import { Orders } from './pages/admin/orders/orders';
// import { Shipments } from './pages/admin/shipments/shipments';
import { Faq } from './pages/home/faq/faq';
import { FaqDetails } from './pages/home/faq-details/faq-details';
import { Details } from './pages/home/collections/details/details';
import { Cart } from './pages/home/cart/cart';
import { Checkout } from './pages/home/cart/checkout/checkout';
import { Check } from './pages/home/check/check';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    children: [
      { path: '', component: Landing },
      // { path: 'collections', component: Collections },
      // { path: 'collections/details/:id', component: Details },
      { path: 'faq', component: Faq },
      { path: 'faq/:id', component: FaqDetails },
      // { path: 'check', component: Check },
      // { path: 'cart', component: Cart, children: [{ path: 'checkout', component: Checkout }] },
    ],
  },
  // { path: 'auth', component: Auth },
  // {
  //   path: 'admin',
  //   component: Admin,
  //   children: [
  //     { path: '', component: Dashboard },
  //     { path: 'orders', component: Orders },
  //     { path: 'shipments', component: Shipments },
  //     { path: '**', redirectTo: '' },
  //   ],
  // },
  { path: '**', redirectTo: '' },
];
