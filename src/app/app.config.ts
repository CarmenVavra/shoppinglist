import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import * as core from '@angular/core';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AuthGuard } from './components/auth/services/auth-guard';
import { RegisterGuard } from './components/auth/services/register-guard';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    AuthGuard,
    RegisterGuard,
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};

export const appConfigWithAuth0: ApplicationConfig = {
  providers: [
    ...appConfig.providers,
    provideAuth0({
      domain: "dev-q5zasy7cz1epxhwx.us.auth0.com",
      clientId: "AZMzcaADckNv5Wlr52OZB7bCmMK82JLr",
      authorizationParams: {
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200',
      },
    }),
  ]
};
