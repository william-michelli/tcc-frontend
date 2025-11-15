import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserData, UserGoogle } from '../models/userData';
import { Router  } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare const google: any; // Permite acessar a API do Google

export interface AppUser {
  google?: UserGoogle;
  backend?: UserData;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKeyGoogle = 'googleUser';
  private storageKeyBackend = 'backendUser';

  //private baseUrl = 'http://localhost:5294/api/';
  private baseUrl = 'https://servicolinux-epgcchhfetabakda.brazilsouth-01.azurewebsites.net/api/';

  private putUrl = this.baseUrl + 'Login'; 

  // BehaviorSubject guarda o estado do usuário (Google + Backend)
  private userSubject = new BehaviorSubject<AppUser>({});
  public user$: Observable<AppUser> = this.userSubject.asObservable();

  constructor(
    private router: Router, 
    private http: HttpClient
  ) {
    const savedGoogle = localStorage.getItem(this.storageKeyGoogle);
    const savedBackend = localStorage.getItem(this.storageKeyBackend);

    this.userSubject.next({
      google: savedGoogle ? JSON.parse(savedGoogle) : undefined,
      backend: savedBackend ? JSON.parse(savedBackend) : undefined
    });
  }

  // Google
  setGoogleUser(user: UserGoogle) {
    localStorage.setItem(this.storageKeyGoogle, JSON.stringify(user));
    const current = this.userSubject.getValue();
    this.userSubject.next({ ...current, google: user });
  }

  clearGoogleUser() {
    localStorage.removeItem(this.storageKeyGoogle);
    const current = this.userSubject.getValue();
    this.userSubject.next({ ...current, google: undefined });
  }

  // Backend
  setBackendUser(user: UserData) {
    localStorage.setItem(this.storageKeyBackend, JSON.stringify(user));
    const current = this.userSubject.getValue();
    this.userSubject.next({ ...current, backend: user });

    this.router.navigate(['/']);//Navega pra tela inicial
  }

  clearBackendUser() {
    localStorage.removeItem(this.storageKeyBackend);
    const current = this.userSubject.getValue();
    this.userSubject.next({ ...current, backend: undefined });
  }

  clearAll() {
    this.clearGoogleUser();
    this.clearBackendUser();
  }

  updateUserCompany(userBackend: UserData) {
    const headers: any = {};

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;


    return this.http.put<UserData>(this.putUrl, userBackend, { headers });
  }

  updateUserCompanyLocally(userBackend: UserData) {
    localStorage.setItem(this.storageKeyBackend, JSON.stringify(userBackend));

    // Atualiza o BehaviorSubject
    const current = this.userSubject.getValue();
    this.userSubject.next({ ...current, backend: userBackend });
  }

  isAdmin(): boolean {
    return !!this.getBackendUser()?.isAdmin;
  }

  getGoogleUser(): UserGoogle | undefined {
    return this.userSubject.getValue().google;
  }

  getBackendUser(): UserData | undefined {
    return this.userSubject.getValue().backend;
  }

  logout(){
    // remove tokens armazenados
    localStorage.removeItem("googleCredential");
    localStorage.removeItem("accessToken");

    // limpa user no front
    this.clearAll();

    // desativa seleção automática do Google
    google.accounts.id.disableAutoSelect();

    // limpa o container do botão
    const buttonDiv = document.getElementById('buttonDiv');
    if (buttonDiv) {
      buttonDiv.innerHTML = ''; // remove o botão antigo
    }

    // renderiza novamente o botão do Google
    google.accounts.id.renderButton(
      buttonDiv,
      { theme: 'outline', size: 'large' }
    );
  }
}
