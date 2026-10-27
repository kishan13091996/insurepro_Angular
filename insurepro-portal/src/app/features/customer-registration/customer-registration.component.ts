import { Component, effect, inject, input, output } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './customer-registration.component.html',
})
export class CustomerRegistrationComponent {
  // ==============================
  // Signal Input
  // ==============================

  customer = input<Customer | undefined>();

  // ==============================
  // Signal Output
  // ==============================

  saved = output<void>();

  private fb = inject(FormBuilder);

  private customerService = inject(CustomerService);

  // ==============================
  // Form
  // ==============================

  form = this.fb.nonNullable.group({
    customerNumber: ['', Validators.required],

    name: ['', [Validators.required, Validators.minLength(3)]],

    email: ['', [Validators.required, Validators.email]],

    phone: ['', Validators.required],

    status: ['', Validators.required],
  });

  // ==============================
  // React to Input Changes
  // ==============================

  constructor() {
    effect(() => {
      const customer = this.customer();

      if (customer) {
        this.form.patchValue(customer);
      } else {
        this.form.reset();
      }
    });
  }

  // ==============================
  // Save
  // ==============================

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const customer = this.customer();

    // ==============================
    // UPDATE
    // ==============================

    if (customer) {
      const updatedCustomer: Customer = {
        id: customer.id,

        ...this.form.getRawValue(),
      };

      this.customerService.updateCustomer(updatedCustomer).subscribe({
        next: () => {
          this.saved.emit();
        },

        error: (error) => {
          console.error('Update failed', error);
        },
      });
    }

    // ==============================
    // CREATE
    // ==============================
    else {
      this.customerService.createCustomer(this.form.getRawValue()).subscribe({
        next: () => {
          this.saved.emit();
        },

        error: (error) => {
          console.error('Create failed', error);
        },
      });
    }
  }
}
