import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-color-preference',
  imports: [CommonModule, ImageModule],
  templateUrl: './color-preference.html',
  styleUrl: './color-preference.scss',
})
export class ColorPreference {
  private readonly _tipsList: { title: string; tips: string[] }[] = [
    {
      title: 'Tono de piel claro',
      tips: [
        'Medias veladas efecto Beyoncé: color claro.',
        'Medias malla profesionales: color claro si deseas mantener el tono natural de tu piel o color canela si prefieres un tono más bronceado.',
      ],
    },
    {
      title: 'Tono de piel medio',
      tips: [
        'Medias veladas efecto Beyoncé: color canela.',
        'Medias malla profesionales: color canela para mantener el tono natural de tu piel.',
      ],
    },
    {
      title: 'Tono de piel oscuro',
      tips: [
        'Medias veladas efecto Beyoncé: color canela.',
        'Medias malla profesionales: color caramelo para mantener el tono natural de tu piel.',
      ],
    },
  ];

  get tipsList() {
    return this._tipsList;
  }
}
