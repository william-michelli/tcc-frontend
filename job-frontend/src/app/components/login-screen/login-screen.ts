import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { UserService, AppUser } from '../../services/user.service';
import { JobService } from '../../services/job.service';
import { UserData, UserGoogle } from '../../models/userData';
import { Router  } from '@angular/router';

declare const google: any; // Permite acessar a API do Google

@Component({
  selector: 'app-login-screen',
  imports: [CommonModule, RouterModule],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css'
})
export class LoginScreen {

  user: AppUser = {};

  constructor(
    private jobService: JobService, 
    private userService: UserService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    // Configura o callback global do Google
    (window as any).handleCredentialResponse = (response: any) => {
      this.ngZone.run(() => {   // <-- força Angular a atualizar tela
        localStorage.setItem('googleCredential', response.credential);

        const decoded = this.decodeJwt(response.credential);
        this.userService.setGoogleUser({
          googleId: decoded.sub,
          name: decoded.name,
          picture: decoded.picture,
          email: decoded.email
        });

        this.cdr.detectChanges(); // força o Angular a redesenhar

        // Envia LOGIN pro backend
        this.jobService.loginWithGoogle(response.credential).subscribe({
          next: (data) => {
            localStorage.setItem("accessToken", data.accessToken);

            this.userService.setBackendUser({
              name: data.name,
              email: data.email,
              companyName: data.companyName,
              isAdmin: data.isAdmin,
              accessToken: data.accessToken
            });// salva no storage

            //Atualiza a lista de jobs assim que o usuário loga
            jobService.getJobs();
          },
          error: (err) => {
            console.error('Erro ao enviar login para backend', err);
          }
        });
      });
    };

    //Verifica se já existe credencial armazenada
    const credential = localStorage.getItem('googleCredential');
    if (credential) {
      const decoded = this.decodeJwt(credential);

      this.userService.setGoogleUser({
          googleId: decoded.sub,
          name: decoded.name,
          picture: decoded.picture,
          email: decoded.email
        });
    }

    if (credential == null) {
      console.log("Sem usuario logado")
    }
  }

  ngOnInit() {
    // Subscribe para receber atualizações do usuário
    this.userService.user$.subscribe(u => {
      this.user = u;
    });
  }

  ngAfterViewInit() {
    // Chama a função que inicializa o botão do Google
    this.initGoogleButton();
  }

  logout() {
    this.userService.logout()
  }
  
  // Função para decodificar JWT retornado pelo Google
  decodeJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
    );
    return JSON.parse(jsonPayload);
  }
  
  private initGoogleButton(retryCount = 0) {
    // Verifica se o script do Google já foi carregado
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id: '508233879472-2tk77dasvemfji4902qf8mbq1kpemfb4.apps.googleusercontent.com',
        callback: (window as any).handleCredentialResponse,
        auto_select: true
      });

      const buttonDiv = document.getElementById('buttonDiv');
      if (buttonDiv) {
        google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large'
        });
        google.accounts.id.prompt();
      }
    } else if (retryCount < 10) {
      // Caso o script ainda não tenha carregado, tenta novamente em 500ms
      setTimeout(() => this.initGoogleButton(retryCount + 1), 500);
    } else {
      console.error('❌ Erro: script do Google não foi carregado após várias tentativas.');
    }
  }

}
