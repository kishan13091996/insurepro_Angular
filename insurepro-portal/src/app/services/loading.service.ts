import { Service, signal } from '@angular/core';

@Service()
export class LoadingService {
    private activeRequests = signal(0);
    readonly isLoading = this.activeRequests.asReadonly();
    show(): void{
        this.activeRequests.update(
            value => value +1 
        );
    }
    hide(): void {
        this.activeRequests.update(
            value => Math.max(0,value-1)
        );
    }
//     private activeRequests = signal(0);

//   readonly isLoading = this.activeRequests.asReadonly();

//   show(): void {
//     this.activeRequests.update(
//       value => value + 1
//     );
//   }

//   hide(): void {
//     this.activeRequests.update(
//       value => Math.max(0, value - 1)
//     );
//   }
}
