import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { Menu } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterOutlet,
    BreadcrumbModule,
    Menu,
    AvatarModule,
    BadgeModule,
    RippleModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  breadcrumb: MenuItem[] | undefined;
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.breadcrumb = [{ label: 'Dashboard' }];

    this.items = [
      {
        separator: true,
      },
      {
        label: 'Gestión',
        items: [
          {
            label: 'Pedidos',
            icon: 'pi pi-plus',
            command: () => {
              this.router.navigate(['/admin/orders'], { relativeTo: this.route });
            },
          },
          {
            label: 'Envíos',
            icon: 'pi pi-search',
            command: () => {
              this.router.navigate(['/admin/shipments'], { relativeTo: this.route });
            },
          },
        ],
      },
      {
        label: 'Perfil',
        items: [
          {
            label: 'Configuración',
            icon: 'pi pi-cog',
            disabled: true,
            command: () => {
              this.router.navigate(['/admin/settings'], { relativeTo: this.route });
            },
          },
          {
            label: 'Mensajes',
            icon: 'pi pi-inbox',
            disabled: true,
            command: () => {
              this.router.navigate(['/admin/messages'], { relativeTo: this.route });
            },
          },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => {
              alert('Cerrar sesión');
              this.router.navigate(['/']);
            },
          },
        ],
      },
      {
        separator: true,
      },
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/admin' };
  }
}
