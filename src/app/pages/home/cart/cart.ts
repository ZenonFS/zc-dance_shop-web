import { Component, inject, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Cart as CartInstance } from '@/domain/use-cases/cart';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import IProductCart from '@/shared/interfaces/cart.interfaces';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router, RouterOutlet, RouterLink } from '@angular/router';
import { EcommerceService } from '@/domain/api/rest/ecommerce.service';
import { DateTime } from 'luxon';
import { environment } from '@/environments/environment';
import { CreateContactDTO, UpdateContactDTO } from '@/shared/interfaces/clients.interfaces';
import { Popover } from 'primeng/popover';
import { Tooltip } from 'primeng/tooltip';
import HotToastClass from '@/shared/utils/helpers/hot-toast.helper';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    InputNumberModule,
    ConfirmPopupModule,
    FormsModule,
    Card,
    Button,
    Divider,
    Checkbox,
    InputNumber,
    CurrencyPipe,
    RouterOutlet,
    Popover,
    Tooltip,
    RouterLink,
    ConfirmDialog,
  ],
  providers: [ConfirmationService, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  standalone: true,
})
export class Cart implements OnInit {
  readonly #currencyPipe: CurrencyPipe = inject(CurrencyPipe);
  readonly #router: Router = inject(Router);
  readonly #route: ActivatedRoute = inject(ActivatedRoute);
  readonly #cartInstance: CartInstance = inject(CartInstance);
  readonly #ecommerceInstance: EcommerceService = inject(EcommerceService);
  readonly #confirmationService: ConfirmationService = inject(ConfirmationService);
  readonly #hotToastInstance: HotToastClass = inject(HotToastClass);

  isLoading = false;

  transactionReference!: string;

  #signatureIntegrity!: string;
  get signatureIntegrity() {
    return this.#signatureIntegrity;
  }
  #expirationTime!: string;
  get expirationTime() {
    return this.#expirationTime;
  }

  get shippingCostToString() {
    return this.#cartInstance.cartTotalPrice >= 400000
      ? 'Gratis'
      : this.#currencyPipe.transform(this.#cartInstance.shippingCost);
  }
  get cartTotalPrice() {
    return this.#cartInstance.cartTotalPrice;
  }

  get discountPercentage() {
    return this.#cartInstance.discountPercentage;
  }
  get discountAmount() {
    return this.#cartInstance.discountAmount;
  }

  get cartTotal() {
    return this.#cartInstance.cartTotalPrice < 400000
      ? this.#cartInstance.cartTotalWithDiscount + this.#cartInstance.shippingCost
      : this.#cartInstance.cartTotalWithDiscount;
  }

  get cartTotalProducts() {
    return this.#cartInstance.cartTotalProducts;
  }

  get products() {
    return this.#cartInstance.products;
  }
  get filteredProducts() {
    return this.#cartInstance.products.filter(({ isSelected }) => isSelected);
  }

  isSelectAllProducts = true;

  get cartTotalPriceInCents() {
    const cartTotalPrice = String(
      this.#cartInstance.cartTotalWithDiscount + this.#cartInstance.shippingCost,
    );
    return cartTotalPrice.padEnd(cartTotalPrice.length + 2, '0');
  }

  get canFinalize() {
    return (
      this.#cartInstance.fgFacturation.valid &&
      this.#cartInstance.fgShipping.valid &&
      this.#cartInstance.fcEmail.valid &&
      !!this.transactionReference &&
      !!this.#cartInstance.transactionId
    );
  }

  ngOnInit() {
    const transactionReference = this.#route.snapshot.queryParamMap.get('transactionReference');
    if (!transactionReference) {
      this.#router.navigate(['/cart']);
      return;
    }
    this.transactionReference = transactionReference;

    const transactionId = this.#route.snapshot.queryParamMap.get('transactionId');
    if (transactionId) {
      this.#cartInstance.transactionId = transactionId;
      this.#loadTransaction(transactionId);
    }
  }

  ngOnDestroy() {
    this.#cartInstance.fgShipping.reset();
    this.#cartInstance.fgFacturation.reset({ kindOfPerson: 'PERSON_ENTITY' });
    this.transactionReference = '';
    this.#cartInstance.transactionId = null;
  }

  async #loadTransaction(transactionId: string) {
    const { results } = await this.#ecommerceInstance.getTransaction(transactionId);

    if (!results) return;

    this.#cartInstance.facturationData = results.facturationData;
    this.#cartInstance.shippingData = results.shippingData;
  }

  async deleteProduct(uuid: string) {
    await this.#cartInstance.deleteProduct(uuid);
  }

  confirm(event: Event, product: IProductCart) {
    this.#confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de querer eliminar el producto?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
      },
      accept: () => {
        this.deleteProduct(product.uuid);
      },
    });
  }

  async createClient() {
    this.#cartInstance.fcState.enable();
    this.#cartInstance.fcFullName.enable();

    const {
      address,
      city,
      fullName,
      nationalId,
      phoneNumber,
      state,
      firstName,
      secondName,
      lastName,
    } = this.#cartInstance.shippingData;

    this.#cartInstance.fcState.disable();
    this.#cartInstance.fcFullName.disable();
    try {
      this.isLoading = true;
      const { results } = await this.#ecommerceInstance.postCreateClient({
        kindOfPerson: 'PERSON_ENTITY',
        identificationObject: {
          type: 'CC',
          number: nationalId ?? '',
        },
        mobile:
          phoneNumber?.replace('(', '').replace(')', '').replace('-', '').replaceAll(' ', '') ?? '',
        email: this.#cartInstance.fcEmail.value ?? '',
        address: {
          address: address ?? '',
          city: city ?? '',
          country: 'Colombia',
          department: state ?? '',
        },
        name: fullName ?? '',
        nameObject: {
          firstName: firstName ?? '',
          secondName: secondName ?? '',
          lastName: lastName ?? '',
        },
      } satisfies CreateContactDTO);

      if (!results) throw new Error('Results is void');

      this.#cartInstance.isNewClient = false;
      this.#cartInstance.clientId = results['id'];
    } catch (error) {
      console.error('[continue] postCreateClient - error', error);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  async updateClient() {
    this.#cartInstance.fcState.enable();
    this.#cartInstance.fcFullName.enable();

    const {
      address,
      city,
      fullName,
      nationalId,
      phoneNumber,
      state,
      firstName,
      secondName,
      lastName,
    } = this.#cartInstance.shippingData;

    this.#cartInstance.fcState.disable();
    this.#cartInstance.fcFullName.disable();

    try {
      if (!this.#cartInstance.clientId) throw new Error('Client ID no registrado');
      this.isLoading = true;

      const { results } = await this.#ecommerceInstance.putUpdateClient(
        this.#cartInstance.clientId,
        {
          kindOfPerson: 'PERSON_ENTITY',
          identificationObject: {
            type: 'CC',
            number: nationalId ?? '',
          },
          mobile:
            phoneNumber?.replace('(', '').replace(')', '').replace('-', '').replaceAll(' ', '') ??
            '',
          email: this.#cartInstance.fcEmail.value ?? '',
          address: {
            address: address ?? '',
            city: city ?? '',
            country: 'Colombia',
            department: state ?? '',
          },
          name: fullName ?? '',
          nameObject: {
            firstName: firstName ?? '',
            secondName: secondName ?? '',
            lastName: lastName ?? '',
          },
        } satisfies UpdateContactDTO,
      );

      if (!results) throw new Error('Results is void');
    } catch (error) {
      console.error('[continue] putUpdateClient - error', error);
      return;
    } finally {
      this.isLoading = false;
    }
  }

  async createTransaction() {
    try {
      this.isLoading = true;
      this.#cartInstance.fcShippingState.enable();
      this.#cartInstance.fcState.enable();
      this.#cartInstance.fcShippingFullName.enable();
      this.#cartInstance.fcFullName.enable();

      const { results } = await this.#ecommerceInstance.postCreateTransaction({
        products: this.filteredProducts,
        reference: this.transactionReference,
        facturationData: {
          ...this.#cartInstance.facturationData,
          id: this.#cartInstance.clientId ?? '',
        },
        shippingData: { ...this.#cartInstance.shippingData, cost: this.#cartInstance.shippingCost },
      });

      this.#cartInstance.fcShippingState.disable();
      this.#cartInstance.fcState.disable();
      this.#cartInstance.fcShippingFullName.disable();
      this.#cartInstance.fcFullName.disable();

      if (!results) throw new Error('Results is void');

      this.#cartInstance.transactionId = results['_id'];
      this.#router.navigate([], {
        queryParams: {
          transactionReference: this.transactionReference,
          transactionId: this.#cartInstance.transactionId,
        },
        relativeTo: this.#route,
      });

      return results['_id'];
    } catch (error) {
      console.error('[continue] postCreateTransaction - error', error);
      // Recarga la página después de la navegación
      window.location.reload();
    } finally {
      this.isLoading = false;
    }
  }

  async continueToLastStep(transactionId: string) {
    try {
      const realTransactionId = this.#cartInstance.transactionId ?? transactionId;
      this.isLoading = true;

      this.#cartInstance.fcShippingState.enable();
      this.#cartInstance.fcState.enable();
      this.#cartInstance.fcShippingFullName.enable();
      this.#cartInstance.fcFullName.enable();

      await this.#ecommerceInstance.patchUpdateTransaction(realTransactionId, {
        products: this.filteredProducts,
        reference: this.transactionReference,
        facturationData: {
          ...this.#cartInstance.facturationData,
          id: this.#cartInstance.clientId ?? '',
        },
        shippingData: { ...this.#cartInstance.shippingData, cost: this.#cartInstance.shippingCost },
      });

      this.#cartInstance.fcShippingState.disable();
      this.#cartInstance.fcState.disable();
      this.#cartInstance.fcShippingFullName.disable();
      this.#cartInstance.fcFullName.disable();

      if (this.#cartInstance.fgFacturation.valid) {
        if (this.#cartInstance.isNewClient && !this.#cartInstance.clientId) await this.createClient();
        else await this.updateClient();

        if (!this.#cartInstance.clientId) throw new Error('Client ID no registrado');

        await this.#ecommerceInstance.patchUpdateTransaction(realTransactionId, {
          products: this.filteredProducts,
          reference: this.transactionReference,
          facturationData: {
            ...this.#cartInstance.facturationData,
            id: this.#cartInstance.clientId,
          },
          shippingData: {
            ...this.#cartInstance.shippingData,
            cost: this.#cartInstance.shippingCost,
          },
        });

        if (realTransactionId)
          if (this.canFinalize) {
            await this.payWithWompi();
            return;
          } else {
            if (this.#cartInstance.fgShipping.invalid) {
              this.#hotToastInstance.infoNotification('Por favor completa los datos de envío.');
              this.#cartInstance.fgShipping.markAllAsDirty();
              this.#cartInstance.fgShipping.markAllAsTouched();
            }
            if (this.#cartInstance.fcEmail.invalid) {
              this.#hotToastInstance.infoNotification('Por favor completa los datos de contacto.');
              this.#cartInstance.fcEmail.markAllAsDirty();
              this.#cartInstance.fcEmail.markAllAsTouched();
            }
            return;
          }
      } else {
        this.#hotToastInstance.infoNotification('Por favor completa los datos de facturación.');
        this.#cartInstance.fgFacturation.markAllAsDirty();
        this.#cartInstance.fgFacturation.markAllAsTouched();
        return;
      }

      this.#router.navigate([], {
        queryParams: {
          transactionReference: this.transactionReference,
          transactionId: this.#cartInstance.transactionId,
        },
        relativeTo: this.#route,
      });
    } catch (error) {
      console.error('[continue] patchUpdateTransaction - error', error);
      // Recarga la página después de la navegación
      // window.location.reload();
    } finally {
      this.isLoading = false;
    }
  }

  async continue($event: Event) {
    if (!this.transactionReference) {
      try {
        this.isLoading = true;
        const { results } = await this.#ecommerceInstance.postReference();
        if (results) {
          this.transactionReference = results;
          this.#router.navigate(['/cart/checkout'], {
            queryParams: { transactionReference: results },
            fragment: 'form-contact',
          });
        }
      } catch (error) {
        console.error('[continue] postReference - error', error);
      } finally {
        this.isLoading = false;
      }
      return;
    } else if (
      !this.#cartInstance.transactionId &&
      this.#cartInstance.fgShipping.valid &&
      this.#cartInstance.fcEmail.valid
    ) {
      this.#confirmationService.confirm({
        target: $event.target as EventTarget,
        message: '¿Desea usar la misma información de envío para la facturación?',
        header: 'Datos de Facturación',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: 'No',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Sí',
        },
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: async () => {
          this.#cartInstance.fcUseShippingData.patchValue(true);
          this.#cartInstance.fcShippingState.enable();
          this.#cartInstance.fcState.enable();

          const fgShippingValue = this.#cartInstance.fgShipping.value;
          this.#cartInstance.fgFacturation.patchValue({
            ...fgShippingValue,
            email: this.#cartInstance.fcEmail.value,
          });

          this.#cartInstance.fcShippingState.disable();
          this.#cartInstance.fcState.disable();
          const transactionId = await this.createTransaction();
          await this.continueToLastStep(transactionId);
        },
        reject: async () => {
          this.#cartInstance.fcUseShippingData.patchValue(false);
          await this.createTransaction();
        },
      });
    } else if (
      this.#cartInstance.transactionId &&
      this.#cartInstance.fgShipping.valid &&
      this.#cartInstance.fcEmail.valid
    ) {
      await this.continueToLastStep(this.#cartInstance.transactionId);
    } else {
      if (this.#cartInstance.fgShipping.invalid) {
        this.#hotToastInstance.infoNotification('Por favor completa los datos de envío.');
        this.#cartInstance.fgShipping.markAllAsDirty();
        this.#cartInstance.fgShipping.markAllAsTouched();
      }
      if (this.#cartInstance.fcEmail.invalid) {
        this.#hotToastInstance.infoNotification('Por favor completa los datos de contacto.');
        this.#cartInstance.fcEmail.markAllAsDirty();
        this.#cartInstance.fcEmail.markAllAsTouched();
      }
      return;
    }
  }

  async payWithWompi() {
    if (!this.signatureIntegrity) await this.getSignatureIntegrity();
    this.#cartInstance.fcState.enable();
    this.#cartInstance.fcFullName.enable();
    const checkout = new WidgetCheckout({
      currency: 'COP',
      amountInCents: this.cartTotalPriceInCents,
      reference: this.transactionReference,
      publicKey: environment.wompi.publicKey,
      signature: { integrity: this.signatureIntegrity },
      redirectUrl: `${environment.selfHost}/check?transactionReference=${
        this.transactionReference
      }&transactionId=${this.#cartInstance.transactionId}`,
      expirationTime: this.expirationTime,
      customerData: {
        email: this.#cartInstance.facturationData.email,
        fullName: this.#cartInstance.facturationData.fullName,
        phoneNumber: this.#cartInstance.facturationData.phoneNumber,
        phoneNumberPrefix: '+57',
        legalId: this.#cartInstance.facturationData.nationalId,
        legalIdType: 'CC',
      },
    });
    this.#cartInstance.fcState.disable();
    this.#cartInstance.fcFullName.disable();

    checkout.open(async (result: any) => {
      await this.#cartInstance.deleteProducts(this.filteredProducts.map(({ uuid }) => uuid));

      const transaction = result.transaction;

      this.#router.navigate(['/check'], {
        queryParams: {
          transactionReference: transaction.reference,
          transactionId: this.#cartInstance.transactionId,
        },
      });
    });
  }

  goToStore() {
    this.#router.navigate(['/collections']);
  }

  async getSignatureIntegrity() {
    const now = DateTime.now().setLocale('es-CO').setZone('America/Bogota');
    this.#expirationTime = now.plus({ hours: 2 }).toISO() ?? '';

    let cadenaConcatenada = `${this.transactionReference}${this.cartTotalPriceInCents}COP${
      this.#expirationTime
    }${environment.wompi.integrity}`;

    //Ejemplo
    const encondedText = new TextEncoder().encode(cadenaConcatenada);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    this.#signatureIntegrity = hashHex;
  }
}
