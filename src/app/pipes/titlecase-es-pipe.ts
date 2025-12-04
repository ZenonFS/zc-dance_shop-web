import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecaseEs',
})
export class TitlecaseEsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase()
      .replace(/(?:^|\s|[¡¿])[a-záéíóúñü]/g, (letra) => letra.toUpperCase());
  }
}
