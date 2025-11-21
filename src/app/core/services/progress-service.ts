import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ProgressService {
    private readonly _isProgressing = signal(false);
    readonly isProgressing = this._isProgressing.asReadonly();

    show() {
        this._isProgressing.set(true);
    }

    hide() {
        this._isProgressing.set(false);
    }
}
