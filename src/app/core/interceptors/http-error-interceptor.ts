import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * 全局错误处理 (403, 400, 500, 网络异常)
 * @param req
 * @param next
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    // todo :toastService
    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            switch (err.status) {
                case 403:
                    // 跳转无权限页面
                    router.navigate(['/forbidden']);
                    break;
                case 500:
                    // 全局提示
                    // toastService.showError('服务器错误，请稍后重试');
                    break;
                case 400:
                case 422:
                    // 参数错误提示
                    // toastService.showError(err.error?.message || '请求错误');
                    break;
                case 0:
                    // 网络错误
                    // toastService.showError('网络异常，请检查连接');
                    break;
            }
            return throwError(() => err);
        }),
    );
};
