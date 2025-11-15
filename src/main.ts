import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

declare global {
    var WidgetCheckout: any;
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
