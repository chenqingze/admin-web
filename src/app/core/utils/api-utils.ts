import { HttpParams } from '@angular/common/http';

/**
 * 构建 查询参数
 * @param paramsObj 查询参数对象
 */
export function buildHttpParams(paramsObj: Record<string, unknown>) {
    let params = new HttpParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params = params.set(key, String(value));
            /*if (typeof value === 'object') {
                params.append(key, JSON.stringify(value));
            } else {
                params.append(key, String(value));
            }*/
        }
    });

    return params;
}

/**
 * 构建原生URLSearchParams
 * @param paramsObj 查询参数对象
 */
export function buildURLSearchParams(paramsObj: Record<string, unknown>) {
    const params = new URLSearchParams();
    // 过滤参数
    Object.entries(paramsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });
    return params;
}
