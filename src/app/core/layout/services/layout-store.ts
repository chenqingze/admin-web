import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LayoutStore {
    // sidebar是否可以折叠成min状态
    private readonly _canCollapse = signal(false);
    readonly canCollapse = this._canCollapse.asReadonly();

    // sidebar是否是折叠min状态
    private readonly _isCollapsed = signal(false);
    readonly isCollapsed = this._isCollapsed.asReadonly();

    toggleCanCollapse() {
        this._canCollapse.set(!this.canCollapse());
    }

    setIsCollapsed(isCollapsed: boolean) {
        this._isCollapsed.set(isCollapsed);
    }
}
