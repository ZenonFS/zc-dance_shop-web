import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CarouselModule, CarouselResponsiveOptions } from 'primeng/carousel';
import { CategoryCard } from '@/app/components/landing/category-card/category-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [
    AnimateOnScrollModule,
    CommonModule,
    ImageModule,
    CarouselModule,
    SkeletonModule,
    CategoryCard,
    NgOptimizedImage,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing implements OnInit {
  products: string[] = [
    'landing/v.carousel_1.JPG',
    'landing/v.carousel_2.jpeg',
    'landing/v.carousel_3.jpeg',
    'landing/v.carousel_4.jpeg',
    'landing/v.carousel_5.jpeg',
  ];
  responsiveOptions: CarouselResponsiveOptions[] | undefined;

  categories: {
    imageSrc: string;
    title: string;
    url: string;
    enterClass: string;
    leaveClass: string;
  }[] = [
    {
      imageSrc: '/landing/category-senior.png',
      title: 'Medias profesionales - Adulto',
      url: '/collections?t=medias-profesionales-adulto',
      enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000',
      leaveClass: 'animate-enter fade-out-10 zoom-out-50 animate-duration-1000',
    },
    {
      imageSrc: '/landing/category-others.png',
      title: 'Accesorios',
      url: '/collections?t=accesorios',
      enterClass: 'animate-enter fade-in-10 zoom-in-75 animate-duration-1000',
      leaveClass: 'animate-enter fade-out-10 zoom-out-75 animate-duration-1000',
    },
    {
      imageSrc: '/landing/category-junior.png',
      title: 'Medias profesionales - Infantil',
      url: '/collections?t=medias-profesionales-junior',
      enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000',
      leaveClass: 'animate-enter fade-out-10 zoom-out-50 animate-duration-1000',
    },
  ];

  constructor(private readonly router: Router) {}

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
  onMouseMove(event: MouseEvent, cardMpa: HTMLDivElement) {
    const rect = cardMpa.getBoundingClientRect();
    const x = event.clientX - rect.left; // pos mouse X dentro del card
    const y = event.clientY - rect.top; // pos mouse Y dentro del card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // calcula rotación en base a distancia del centro
    const rotateX = ((y - centerY) / centerY) * 10; // rango -10 a 10
    const rotateY = ((x - centerX) / centerX) * -10;

    cardMpa.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  onMouseLeave(cardMpa: HTMLDivElement) {
    cardMpa.style.transform = 'rotateX(0) rotateY(0)';
  }

  goToTipDetails(id: string) {
    this.router.navigate(['faq', id]);
  }
}
