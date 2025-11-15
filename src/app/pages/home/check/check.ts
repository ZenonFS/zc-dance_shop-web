import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-check',
  imports: [CommonModule],
  templateUrl: './check.html',
  styleUrl: './check.scss',
})
export class Check {
  readonly #router: Router = inject(Router);
  readonly #route: ActivatedRoute = inject(ActivatedRoute);

  transactionId!: string;
  transactionReference!: string;

  ngOnInit() {
    const transactionReference = this.#route.snapshot.queryParamMap.get('transactionReference');
    const transactionId = this.#route.snapshot.queryParamMap.get('transactionId');
    if (!transactionReference || !transactionId) {
      this.#router.navigate(['/']);
      return;
    }
    this.transactionReference = transactionReference;
    this.transactionId = transactionId;
  }
}
