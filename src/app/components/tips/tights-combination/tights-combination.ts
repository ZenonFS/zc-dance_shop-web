import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { Image } from "primeng/image";

@Component({
  selector: 'app-tights-combination',
  imports: [DividerModule, Image],
  templateUrl: './tights-combination.html',
  styleUrl: './tights-combination.scss',
})
export class TightsCombination {
  sections: {
    title: string;
    items: { imageUrl: string; imageAlt: string; description: string }[];
  }[] = [
    {
      title: 'Tono de piel claro',
      items: [
        {
          imageUrl: '/tips/tights-combination/skin-tone-light-1.1.PNG',
          imageAlt: 'skin-tone-light-1.1',
          description: 'Medias veladas efecto Beyoncé color claro',
        },
        {
          imageUrl: '/tips/tights-combination/skin-tone-light-1.2.PNG',
          imageAlt: 'skin-tone-light-1.2',
          description: 'Medias malla profesionales color claro',
        },
        {
          imageUrl: '/tips/tights-combination/skin-tone-light-1.3.PNG',
          imageAlt: 'skin-tone-light-1.3',
          description: 'Medias malla profesionales color canela',
        },
        {
          imageUrl: '/tips/tights-combination/skin-tone-light-1.4.PNG',
          imageAlt: 'skin-tone-light-1.4',
          description:
            'Medias veladas efecto Beyoncé color claro<br/>+<br/>Medias malla profesionales color canela',
        },
        {
          imageUrl: '/tips/tights-combination/skin-tone-light-1.5.PNG',
          imageAlt: 'skin-tone-light-1.5',
          description:
            'Medias veladas efecto Beyoncé color claro + Medias malla profesionales color claro',
        },
      ],
    },
    {
      title: 'Tono de piel medio',
      items: [
        {
          imageUrl: '/tips/tights-combination/skin-tone-medium-2.1.PNG',
          imageAlt: 'skin-tone-medium-2.1',
          description: 'Medias veladas efecto Beyoncé color canela',
        },
        {
          imageUrl: '/tips/tights-combination/skin-tone-medium-2.2.PNG',
          imageAlt: 'skin-tone-medium-2.2',
          description: 'Medias malla profesionales color canela',
        },
        {
          imageUrl: '/tips/tights-combination/skin-tone-medium-2.3.PNG',
          imageAlt: 'skin-tone-medium-2.3',
          description:
            'Medias veladas efecto Beyoncé color canela + Medias malla profesionales color canela',
        },
      ],
    },
    {
      title: 'Tono de piel oscuro',
      items: [
         {
          imageUrl: '/tips/tights-combination/skin-tone-dark-3.1.PNG',
          imageAlt: 'skin-tone-dark-3.1',
          description: 'Medias veladas efecto Beyoncé color canela',
        },
        {
          imageUrl: '/tips/tights-combination/skin-tone-dark-3.2.PNG',
          imageAlt: 'skin-tone-dark-3.2',
          description: 'Medias malla profesionales color canela',
        },
        {
          imageUrl: '/tips/tights-combination/skin-tone-dark-3.3.PNG',
          imageAlt: 'skin-tone-dark-3.3',
          description:
            'Medias veladas efecto Beyoncé color canela + Medias malla profesionales color canela',
        },
      ],
    },
  ];
}
