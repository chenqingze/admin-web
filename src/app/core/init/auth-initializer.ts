import { inject, provideAppInitializer } from '@angular/core';
import { AuthFacade } from '../auth/services/auth-facade';

export const provideAuthInitializer = provideAppInitializer(() => {
    const authFacade = inject(AuthFacade);
    // 返回 Observable 或 Promise： 如果初始化函数返回一个 Promise 或 Observable，Angular 就会认为这是一个异步任务。
    // 阻止启动： 在这个异步任务完成之前，Angular 会暂停应用程序的启动流程（即不会渲染根组件）。
    // 对于Promise 或 Observable 等异步操作必须 return ,否则angular不会等待其完成
    return authFacade.init();
});
