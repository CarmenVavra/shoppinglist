import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { AuthGuard } from './components/auth/services/auth-guard';
import { RegisterGuard } from './components/auth/services/register-guard';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    AuthGuard,
    RegisterGuard,
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
