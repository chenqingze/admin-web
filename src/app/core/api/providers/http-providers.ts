import { InjectionToken, Provider } from '@angular/core';
import { environment } from '@env/environment';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

export const BASE_URL = new InjectionToken<string>('api base url');
export const UPLOAD_URL = new InjectionToken<string>('upload url');
export const MEDIA_ACCESS_URL = new InjectionToken<string>('media access url');

export const httpProviders: Provider[] = [
    { provide: BASE_URL, useValue: environment.baseUrl },
    { provide: UPLOAD_URL, useValue: environment.uploadUrl },
    { provide: MEDIA_ACCESS_URL, useValue: environment.mediaUrl },
    {
        provide: IMAGE_LOADER,
        useValue: (config: ImageLoaderConfig) => {
            return `${environment.mediaUrl}/${config.src}`;
        },
    },
];
