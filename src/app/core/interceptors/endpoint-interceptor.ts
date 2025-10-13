import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ENDPOINT } from '../../app.config';

export function hasHttpScheme(url: string) {
    return new RegExp('^http(s)?://', 'i').test(url);
}
export const endpointInterceptor: HttpInterceptorFn = (req, next) => {
    const endpoint = inject(ENDPOINT, { optional: true });

    const hasScheme = (url: string) => endpoint && hasHttpScheme(url);

    const prependBaseUrl = (url: string) =>
        [endpoint?.replace(/\/$/g, ''), url.replace(/^\.?\//, '')].filter((val) => val).join('/');

    return hasScheme(req.url) === false ? next(req.clone({ url: prependBaseUrl(req.url) })) : next(req);
};
