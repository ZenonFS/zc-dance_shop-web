import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { Menubar } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Cart } from '../../../domain/use-cases/cart';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ProductCart } from '../../components/collections/product-cart/product-cart';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    Menubar,
    InputTextModule,
    Ripple,
    CommonModule,
    ImageModule,
    SkeletonModule,
    ButtonModule,
    DrawerModule,
    ScrollTopModule,
    OverlayBadgeModule,
    ProductCart,
    TooltipModule,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  items: MenuItem[] | undefined;
  visible: boolean = false;

  get filteredProducts() {
    return this.cart.products.filter(({isSelected}) => isSelected)
  }

  constructor(
    public readonly cart: Cart,
    private readonly router: Router,
    viewport: ViewportScroller
  ) {
    viewport.setOffset([0, 56]);
  }

  ngOnInit() {
    this.items = [
      {
        id: 'home',
        title: 'Inicio',
        label: 'Inicio',
        url: '/',
      },
      // {
      //   id: 'collections',
      //   title: 'Categorías',
      //   label: 'Categorías',
      //   items: [
      //     {
      //       id: 'todas',
      //       label: 'Todas',
      //       url: '/collections',
      //     },
      //     {
      //       id: 'medias-profesionales-adulto',
      //       label: 'Medias profesionales - Adulto',
      //       url: '/collections',
      //       queryParams: {
      //         t: 'medias-profesionales-adulto',
      //       },
      //     },
      //     {
      //       id: 'medias-profesionales-junior',
      //       label: 'Medias profesionales - Infantil',
      //       url: '/collections',
      //       queryParams: {
      //         t: 'medias-profesionales-infantil',
      //       },
      //     },
      //     {
      //       id: 'accesorios',
      //       label: 'Accesorios',
      //       url: '/collections',
      //       queryParams: {
      //         t: 'accesorios',
      //       },
      //     },
      //   ],
      // },
      {
        id: 'tips',
        title: 'Preguntas frecuentes',
        label: 'Preguntas frecuentes',
        url: '/faq',
      },
    ];
  }

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  openInstagram() {
    window.open('https://www.instagram.com/medias.zc', '_blank');
  }

  whatsappPhone: string = '573001663860';
  whatsappMessage: string = 'Hola! quiero más información';

  openWhatsapp() {
    const encodedMessage = encodeURIComponent(this.whatsappMessage);
    window.open(`https://wa.me/${this.whatsappPhone}?text=${encodedMessage}`, '_blank');
  }

  goToCartPage() {
    this.visible = false;
    this.router.navigate(['cart']);
  }
}
