import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Admin } from './pages/admin/admin';
import { Landing } from './pages/home/landing/landing';
import { Collections } from './pages/home/collections/collections';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Auth } from './pages/auth/auth';
import { Orders } from './pages/admin/orders/orders';
import { Shipments } from './pages/admin/shipments/shipments';
import { Faq } from './pages/home/faq/faq';
import { FaqDetails } from './pages/home/faq-details/faq-details';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    children: [
      { path: '', component: Landing },
      { path: 'collections', component: Collections,  },
      { path: 'faq', component: Faq,  },
      { path: 'faq/:id', component: FaqDetails,  },
    ],
  },
  { path: 'auth', component: Auth },
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: '', component: Dashboard },
      { path: 'orders', component: Orders },
      { path: 'shipments', component: Shipments },
      { path: '**', redirectTo: '' },
    ],
  },
  { path: '**', redirectTo: '' },
];
