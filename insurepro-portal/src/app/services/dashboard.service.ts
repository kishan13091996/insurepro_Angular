import { Service } from '@angular/core';
import { Customer } from '../models/customer';

@Service()
export class DashboardService {
    getWelcomeMessage() {
    return 'Welcome to InsurePro Portal';
  }

  
}
