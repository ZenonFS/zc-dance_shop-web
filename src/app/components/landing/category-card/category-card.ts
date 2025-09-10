import { SkeletonModule } from 'primeng/skeleton';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-category-card',
  imports: [SkeletonModule, AnimateOnScrollModule],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {
  @Input() imageSrc!: string;
  @Input() title!: string;
  @Input() url!: string;
  @Input() enterClass!: string;
  @Input() leaveClass!: string;

  constructor(private readonly router: Router) {}

  onMouseMove(event: MouseEvent, cardMpa: HTMLDivElement) {
    const rect = cardMpa.getBoundingClientRect();
    const x = event.clientX - rect.left; // pos mouse X dentro del card
    const y = event.clientY - rect.top; // pos mouse Y dentro del card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // calcula rotación en base a distancia del centro
    const rotateX = ((y - centerY) / centerY) * 12; // rango -12 a 12
    const rotateY = ((x - centerX) / centerX) * -12;

    cardMpa.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  onMouseLeave(cardMpa: HTMLDivElement) {
    cardMpa.style.transform = 'rotateX(0) rotateY(0)';
  }

  navigateTo() {
    const [route, queryParams] = this.url.split('?');
    this.router.navigate([route], {
      queryParams: queryParams
        ? JSON.parse('{"' + queryParams.replace(/&/g, '","').replace(/=/g, '":"') + '"}')
        : {},
    });
  }
}
