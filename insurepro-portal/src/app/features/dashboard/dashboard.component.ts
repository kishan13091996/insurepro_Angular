import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { CustomerRegistrationComponent } from '../customer-registration/customer-registration.component';
import { AuthStateServiceService } from '../../services/auth-state-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    CustomerRegistrationComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private customerService = inject(CustomerService);
  public authState = inject(AuthStateServiceService);

  // ==============================
  // Customer State
  // ==============================

  customers =
    signal<Customer[]>([]);

  selectedCustomer =
    signal<Customer | undefined>(undefined);


  // ==============================
  // Search
  // ==============================

  searchText =
    signal('');


  // ==============================
  // Sorting
  // ==============================

  sortField =
    signal<keyof Customer>('customerNumber');

  sortDirection =
    signal<'asc' | 'desc'>('asc');


  // ==============================
  // Pagination
  // ==============================

  currentPage =
    signal(1);

  pageSize =
    signal(5);


  // ==============================
  // Constructor
  // ==============================

  constructor() {

    effect(() => {

      console.log(
        'Search:',
        this.searchText()
      );

      console.log(
        'Sort:',
        this.sortField(),
        this.sortDirection()
      );

    });

  }


  // ==============================
  // Initialization
  // ==============================

  ngOnInit(): void {

    this.loadCustomers();

  }


  // ==============================
  // Load Customers
  // ==============================

  loadCustomers(): void {

    this.customerService
      .getCustomers()
      .subscribe({

        next: customers => {

          this.customers.set(customers);

        },

        error: error => {

          console.error(
            'Failed to load customers',
            error
          );

        }

      });

  }


  // ==============================
  // Create
  // ==============================

  onCreate(): void {

    this.selectedCustomer.set(
      undefined
    );

  }


  // ==============================
  // Edit
  // ==============================

  onEdit(customer: Customer): void {

    this.selectedCustomer.set(
      customer
    );

  }


  // ==============================
  // Save
  // ==============================

  onSave(): void {

    this.loadCustomers();

    this.selectedCustomer.set(
      undefined
    );

  }


  // ==============================
  // Delete
  // ==============================

  onDelete(id: number): void {

    if (!confirm('Delete customer?')) {
      return;
    }

    this.customerService
      .deleteCustomer(id)
      .subscribe({

        next: () => {

          this.loadCustomers();

        },

        error: error => {

          console.error(
            'Delete failed',
            error
          );

        }

      });

  }


  // ==============================
  // Filter + Sort
  // ==============================

  filteredCustomers = computed(() => {

    let result =
      this.customers();


    // -------- Search --------

    const search =
      this.searchText()
        .trim()
        .toLowerCase();

    if (search) {

      result =
        result.filter(customer =>

          customer.customerNumber
            .toLowerCase()
            .includes(search)

          ||

          customer.name
            .toLowerCase()
            .includes(search)

          ||

          customer.email
            .toLowerCase()
            .includes(search)

          ||

          customer.phone
            .toLowerCase()
            .includes(search)

          ||

          customer.status
            .toLowerCase()
            .includes(search)

        );

    }


    // -------- Sort --------

    const field =
      this.sortField();

    const direction =
      this.sortDirection();


    result =
      [...result].sort(
        (a, b) => {

          const first =
            String(a[field])
              .toLowerCase();

          const second =
            String(b[field])
              .toLowerCase();

          const comparison =
            first.localeCompare(second);

          return direction === 'asc'
            ? comparison
            : -comparison;

        }
      );


    return result;

  });


  // ==============================
  // Search
  // ==============================

  onSearch(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.searchText.set(
      input.value
    );

    // Reset pagination
    this.currentPage.set(1);

  }

    onPageSizeChange(event: Event): void {

    const pageSize =
      event.target as HTMLSelectElement;

    this.pageSize.set(
      Number(pageSize.value)
    );

    // Reset pagination
    this.currentPage.set(1);

  }


  // ==============================
  // Sorting
  // ==============================

  sortCustomers(
    field: keyof Customer
  ): void {

    if (
      this.sortField() === field
    ) {

      this.sortDirection.update(
        direction =>
          direction === 'asc'
            ? 'desc'
            : 'asc'
      );

    }
    else {

      this.sortField.set(field);

      this.sortDirection.set('asc');

    }

  }


  // ==============================
  // Pagination
  // ==============================

  totalPages = computed(() => {

    return Math.max(
      1,
      Math.ceil(
        this.filteredCustomers().length
        / this.pageSize()
      )
    );

  });


  paginatedCustomers = computed(() => {

    const start =
      (this.currentPage() - 1)
      * this.pageSize();

    const end =
      start + this.pageSize();

    return this
      .filteredCustomers()
      .slice(start, end);

  });


  previousPage(): void {

    if (
      this.currentPage() > 1
    ) {

      this.currentPage.update(
        page => page - 1
      );

    }

  }


  nextPage(): void {

    if (
      this.currentPage()
      < this.totalPages()
    ) {

      this.currentPage.update(
        page => page + 1
      );

    }

  }

}

