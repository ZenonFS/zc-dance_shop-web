import { FormsModule } from '@angular/forms';
import { Component, inject, Input } from '@angular/core';
import IProductCart from '../../../../shared/interfaces/cart.interfaces';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { Button } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Cart } from '@/domain/use-cases/cart';
import { InputNumber } from 'primeng/inputnumber';
import HotToastClass from '@/shared/utils/helpers/hot-toast.helper';

@Component({
  selector: 'app-product-cart',
  imports: [
    CommonModule,
    FormsModule,
    ImageModule,
    SkeletonModule,
    Button,
    ConfirmDialog,
    Toast,
    InputNumber,
],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product-cart.html',
  styleUrl: './product-cart.scss',
})
export class ProductCart {
  #hotToast = inject(HotToastClass);

  @Input() product!: IProductCart;

  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly cartInstance: Cart
  ) {}

  confirm2(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro de querer eliminar el producto del carrito?',
      header: 'Eliminar producto',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },

      accept: () => {
        this.cartInstance.deleteProduct(this.product.uuid);
        this.#hotToast.successNotification(`Producto eliminado`);
      },
    });
  }
}
