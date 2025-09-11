import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CarouselModule } from 'primeng/carousel';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { CategoryCard } from '../../../components/landing/category-card/category-card';

@Component({
  selector: 'app-landing',
  imports: [
    AnimateOnScrollModule,
    CommonModule,
    ImageModule,
    CarouselModule,
    SkeletonModule,
    CategoryCard,
    NgOptimizedImage
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  products: any[] = [
    'landing/v.carousel_6.jpg',
    'landing/v.carousel_7.jpg',
    'landing/v.carousel_8.jpg',
    'landing/v.carousel_9.jpg',
  ];
  responsiveOptions: any[] | undefined;

  categories: {
    imageSrc: string;
    title: string;
    url: string;
    enterClass: string;
    leaveClass: string;
  }[] = [
    {
      imageSrc: '/landing/category-senior.jpg',
      title: 'Medias profesionales adulto',
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
      title: 'Medias profesionales junior',
      url: '/collections?t=medias-profesionales-junior',
      enterClass: 'animate-enter fade-in-10 zoom-in-50 animate-duration-1000',
      leaveClass: 'animate-enter fade-out-10 zoom-out-50 animate-duration-1000',
    },
  ];

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
}
