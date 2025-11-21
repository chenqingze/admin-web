import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';
import { ProgressService } from '../../services';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(ProgressService);
    loadingService.show();
    return next(req).pipe(
        finalize(() =>
            setTimeout(() => {
                loadingService.hide();
            }, 500),
        ),
    );
};
