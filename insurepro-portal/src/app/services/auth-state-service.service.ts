import { computed, Service, signal } from '@angular/core';

@Service()
export class AuthStateServiceService {
    private _userName = signal<string | null>(null);
    private _role = signal<string|null>(null);

    userName = this._userName.asReadonly();
    role = this._role.asReadonly();

    isAuthenticated = computed(()=> this._userName!=null);
    
    setUser(userName:string , role:string):void{
        this._userName.set(userName);
        this._role.set(role);
    }

    clearUser():void{
        this._userName.set(null);
        this._role.set(null);
    }
}
