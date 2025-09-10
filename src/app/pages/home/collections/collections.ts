import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ProductCard } from '../../../components/collections/product-card/product-card';
import { IProduct } from '../../../../shared/interfaces/product.interfaces';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Select, SelectChangeEvent } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';

interface ISelectOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-collections',
  imports: [
    SkeletonModule,
    ButtonModule,
    CommonModule,
    ProductCard,
    FormsModule,
    Select,
    SelectButton,
    ChipModule,
  ],
  templateUrl: './collections.html',
  styleUrl: './collections.scss',
})
export class Collections {
  // Mocks
  products: IProduct[] = [
    {
      uuid: '1',
      name: 'Medias Veladas efecto Beyoncé',
      price: 50000,
      description:
        'Medias veladas negras con efecto brillante, perfectas para un look elegante y sofisticado.',
      imageUrl: '/landing/IMG_0322.JPG',
      quantityAvalible: 10,
    },
    {
      uuid: '2',
      name: 'Medias Veladas con diseño de encaje',
      price: 60000,
      description:
        'Medias veladas negras con un delicado diseño de encaje, ideales para ocasiones especiales.',
      imageUrl: '/landing/IMG_0314.JPG',
      quantityAvalible: 5,
    },
    {
      uuid: '3',
      name: 'Medias Veladas con patrón geométrico',
      price: 55000,
      description:
        'Medias veladas negras con un moderno patrón geométrico, perfectas para un look contemporáneo.',
      imageUrl: '/landing/IMG_0315.JPG',
      quantityAvalible: 8,
    },
    {
      uuid: '4',
      name: 'Medias Veladas con detalles brillantes',
      price: 70000,
      description:
        'Medias veladas negras con detalles brillantes, ideales para destacar en cualquier evento.',
      imageUrl: '/landing/IMG_0324.JPG',
      quantityAvalible: 3,
    },
  ];

  types: ISelectOption[] = [
    {
      name: 'Medias Profesionales Adulto',
      value: 'medias-profesionales-adulto',
    },
    {
      name: 'Medias Profesionales Junior',
      value: 'medias-profesionales-junior',
    },
    {
      name: 'Accesorios',
      value: 'accesorios',
    },
  ];
  sizes: ISelectOption[] = [
    { name: 'S', value: 's' },
    { name: 'M', value: 'm' },
    { name: 'L', value: 'l' },
    { name: 'Única', value: 'u' },
  ];
  colors: ISelectOption[] = [
    { name: 'Canela', value: 's' },
  ];

  // Filter Form
  fgFilters: FormGroup<{
    fcColor: FormControl<ISelectOption | null>,
    fcSize: FormControl<ISelectOption | null>,
    fcType: FormControl<ISelectOption | null>,
    fcDenier: FormControl<ISelectOption | null>,
  }> = new FormGroup({
    fcColor: new FormControl<ISelectOption | null>(null),
    fcSize: new FormControl<ISelectOption | null>(null),
    fcType: new FormControl<ISelectOption | null>(null),
    fcDenier: new FormControl<ISelectOption | null>(null),
  });

  get totalProducts() {
    return this.products.length;
  }

  get selectedColor() {
    return this.fgFilters.controls.fcColor.value?.value
  }

  get selectedSize() {
    return this.fgFilters.controls.fcSize.value?.value
  }

  get selectedType() {
    return this.fgFilters.controls.fcType.value?.value
  }

  get selectedDenier() {
    return this.fgFilters.controls.fcDenier.value?.value
  }

  set setSelectedType(selectedOption: ISelectOption) {
    this.fgFilters.controls.fcType.patchValue(selectedOption)
  }

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    const qpType = this.route.snapshot.queryParamMap.get('t');
    console.log('qpType', qpType);

    if (qpType) {
      const type = this.types.find(({ value }) => value === qpType);
      console.log('type', type);

      if (type) this.fgFilters.controls.fcType.patchValue(type)
    }
  }

  onChangeFilter($event: SelectChangeEvent, inputRef: string) {
    console.log($event.value)
    this.setSelectedType = $event.value
  }
}
