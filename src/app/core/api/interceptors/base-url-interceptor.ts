import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BASE_URL } from '../providers/http-providers';

export function hasHttpScheme(url: string) {
    return new RegExp('^http(s)?://', 'i').test(url);
}

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
    const baseUrl = inject(BASE_URL);

    const hasScheme = (url: string) => baseUrl && hasHttpScheme(url);

    const prependBaseUrl = (url: string) =>
        [baseUrl?.replace(/\/$/g, ''), url.replace(/^\.?\//, '')].filter((val) => val).join('/');

    return hasScheme(req.url) === false ? next(req.clone({ url: prependBaseUrl(req.url) })) : next(req);
};
