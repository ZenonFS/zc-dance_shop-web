import { inject, Injectable } from '@angular/core';
import { HotToastService, ToastPosition } from '@ngxpert/hot-toast';
/** funciones para mostrar toast */
@Injectable({ providedIn: 'root' })
export default class HotToastClass {
  toast = inject(HotToastService);
  private duration: number = 4000;
  private position: ToastPosition = 'top-right';
  private generalStyle = {
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    margin: '8px 8px 8px 8px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  };

  #normalizeMessage(message: string): string {
    return message
      .trim()
      .replaceAll(/\s+/g, ' ') // reemplazar múltiples espacios en blanco por un solo espacio en blanco
      .replaceAll('undefined', '')
      .replaceAll('null', '')
      .replaceAll('NaN', '');
  }

  successNotification(message: string): void {
    if (message.trim() === '') {
      console.error(
        "❌ error - successNotification - ngxpert/hot-toast - el mensaje no puede ser un string vacio ''"
      );
      return;
    }
    this.toast.show(`Éxito<p>${this.#normalizeMessage(message)}</p>`, {
      duration: 3000,
      position: this.position,
      style: { background: 'oklch(78.9% 0.154 211.53)', color: '#fff', ...this.generalStyle },
      autoClose: true,
      dismissible: true,
    });
  }

  errorNotification(message: string): void {
    if (String(message).trim() === '') {
      console.error(
        "❌ error - errorNotification - ngxpert/hot-toast - el mensaje no puede ser un string vacio ''"
      );
      return;
    }
    this.toast.show(`Error<p>${this.#normalizeMessage(message)}</p>`, {
      duration: this.duration,
      position: this.position,
      style: { background: '#d03035', color: '#fff', ...this.generalStyle },
      dismissible: true,
    });
  }
  infoNotification(message: string): void {
    if (String(message).trim() === '') {
      console.error(
        "❌ error - infoNotification - ngxpert/hot-toast - el mensaje no puede ser un string vacio ''"
      );
      return;
    }
    this.toast.show(`Aviso<p>${this.#normalizeMessage(message)}</p>`, {
      duration: this.duration,
      position: this.position,
      style: { background: '#61aaec', color: '#fff', ...this.generalStyle },
      dismissible: true,
    });
  }
  warningNotification(message: string): void {
    if (String(message).trim() === '') {
      console.error(
        "❌ error - warningNotification - ngxpert/hot-toast - el mensaje no puede ser un string vacio ''"
      );
      return;
    }
    this.toast.show(`Advertencia<p>${this.#normalizeMessage(message)}</p>`, {
      duration: this.duration,
      position: this.position,
      style: { background: '#f4d745', color: '#fff', ...this.generalStyle },
    });
  }
}
