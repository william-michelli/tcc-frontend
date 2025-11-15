import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';



bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(SocialLoginModule), // importa o módulo do Social Login
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '508233879472-2tk77dasvemfji4902qf8mbq1kpemfb4.apps.googleusercontent.com'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
}).catch(err => console.error(err));