import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractCrudApi<T> {
    // 使用 inject 函数注入 HttpClient
    protected http = inject(HttpClient);

    // 抽象属性：要求子类必须实现并提供 API 的基础路径
    protected abstract readonly endpoint: string;

    // 获取所有记录
    getAll(params?: HttpParams): Observable<T[]> {
        return this.http.get<T[]>(this.endpoint, { params });
    }

    // 根据 ID 获取单个记录
    getById(id: number | string): Observable<T> {
        const url = `${this.endpoint}/${id}`;
        return this.http.get<T>(url);
    }

    // 创建新记录
    create(item: Omit<T, 'id'>): Observable<T> {
        // 假设您的后端在创建成功后返回完整的 T 对象 (包含 id)
        // Omit<T, 'id'> 表示传入的对象结构与 T 相同，但没有 'id' 属性
        return this.http.post<T>(this.endpoint, item);
    }

    // 更新记录
    update(id: number | string, item: Partial<T>): Observable<T> {
        // Partial<T> 表示传入的对象结构是 T 的部分属性（用于部分更新）
        const url = `${this.endpoint}/${id}`;
        return this.http.put<T>(url, item); // 或使用 patch<T>(url, item) 进行局部更新
    }

    // 删除记录
    delete(id: number | string): Observable<void> {
        const url = `${this.endpoint}/${id}`;
        // 假设删除成功返回空响应体
        return this.http.delete<void>(url);
    }
}
