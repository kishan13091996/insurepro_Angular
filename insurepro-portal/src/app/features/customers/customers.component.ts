import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { CustomerRegistrationComponent } from '../customer-registration/customer-registration.component';

@Component({
  selector: 'app-customers',
  imports: [CustomerRegistrationComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  selectedCustomer = signal<Customer | undefined>(undefined);

  searchText = signal('');
  sortField = signal<keyof Customer>('customerNumber');
  sortDirection = signal<'asc' | 'desc'>('asc');

  currentPage = signal(1);
  pageSize = signal(5);

  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load customers', error);
        this.errorMessage.set('Failed to load customers. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  onCreate(): void {
    this.selectedCustomer.set(undefined);
  }

  onEdit(customer: Customer): void {
    this.selectedCustomer.set(customer);
  }

  onSave(): void {
    this.loadCustomers();
    this.selectedCustomer.set(undefined);
  }

  onDelete(id: number): void {
    if (!confirm('Delete customer?')) return;

    this.customerService.deleteCustomer(id).subscribe({
      next: () => this.loadCustomers(),
      error: (error) => console.error('Delete failed', error),
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
    this.currentPage.set(1);
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize.set(Number(select.value));
    this.currentPage.set(1);
  }

  sortCustomers(field: keyof Customer): void {
    if (this.sortField() === field) {
      this.sortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  filteredCustomers = computed(() => {
    let result = this.customers();

    const search = this.searchText().trim().toLowerCase();

    if (search) {
      result = result.filter(
        (customer) =>
          customer.customerNumber.toLowerCase().includes(search) ||
          customer.name.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search) ||
          customer.phone.toLowerCase().includes(search) ||
          customer.status.toLowerCase().includes(search),
      );
    }

    const field = this.sortField();
    const direction = this.sortDirection();

    return [...result].sort((a, b) => {
      const first = String(a[field]).toLowerCase();
      const second = String(b[field]).toLowerCase();
      const comparison = first.localeCompare(second);

      return direction === 'asc' ? comparison : -comparison;
    });
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredCustomers().length / this.pageSize())),
  );

  paginatedCustomers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredCustomers().slice(start, start + this.pageSize());
  });

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }
}
