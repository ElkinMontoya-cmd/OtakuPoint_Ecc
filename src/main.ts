import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- Corregido aquí

bootstrapApplication(AppComponent, appConfig) // <-- Asegúrate de que aquí diga AppComponent
  .catch((err) => console.error(err));