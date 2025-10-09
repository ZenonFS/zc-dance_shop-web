import { Component } from '@angular/core';

@Component({
  selector: 'app-tights-caution',
  imports: [],
  templateUrl: './tights-caution.html',
  styleUrl: './tights-caution.scss',
})
export class TightsCaution {
  sections: {
    title: string;
    items: string[];
  }[] = [
    {
      title: 'Lávalas con amor',
      items: [
        'Lávalas a mano con agua fría o tibia.',
        'Usa jabón suave o especial para prendas delicadas.',
        'Evita la lavadora y la secadora, pueden dañar las fibras.',
        'Después de lavarlas, no las retuerzas.',
        'Déjalas secando al aire, en un lugar ventilado y sin sol directo.',
        'No uses plancha, calor o secador, ya que pueden deformarse.',
      ],
    },
    {
      title: 'Guárdalas correctamente',
      items: [
        'Asegúrate de que estén completamente secas antes de guardarlas.',
        'Dóblalas suavemente y guárdalas en un lugar limpio, lejos de objetos que puedan engancharlas.',
        'Usa la bolsa reutilizable para transportarlas a tus shows.',
      ],
    },
    {
      title: 'Cuidado al usarlas',
      items: [
        'Enrolla toda la medias hasta el final, introduce los dedos de los pies manteniendo las manos ubicadas dentro de las medias, súbelas poco a poco a la misma velocidad (si subes la pierna izquierda hasta el tobillo, haz lo mismo con la derecha).',
        'Asegúrate que no ten que no tengan contacto con superficies rugosas yen especial con objetos filosos.',
        'Ten precaución con el el vestuario que vas a usar y el de tus compañer@s.',
      ],
    },
  ];
}
