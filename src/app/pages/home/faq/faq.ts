import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IFAQ } from '@/shared/interfaces/faq.interfaces';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq',
  imports: [
    CommonModule,
    FormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  text: string | undefined;

  faqs: IFAQ[] = [
    {
      id: 'color-preference',
      title: '¿Cómo escoger el color correctamente?',

    },
    {
      id: 'tights-combination',
      title: '¿Cómo combinar las medias para lograr el look ideal?',
    },
    {
      id: 'tights-caution',
      title: '¿Cómo cuidar correctamente las medias?',
    },
    {
      id: 'heel-protectors',
      title: '¿Para qué sirven los protectores del tacón?',
    },
      {
      id: 'shoe-brush',
      title: '¿Para qué sirve el cepillo de zapato?',
    },
  ];

  activeIndex: number = 0;

  constructor(private readonly router: Router) {}

  activeIndexChange(index: number) {
    this.activeIndex = index;
  }

  goToDetails(faq: IFAQ) {
    this.router.navigate(['faq', faq.id])
  }
}
