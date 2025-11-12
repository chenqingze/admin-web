import {
    computed,
    DOCUMENT,
    effect,
    inject,
    Injectable,
    linkedSignal,
    Renderer2,
    RendererFactory2,
} from '@angular/core';
import { PREFERRED_COLOR_MODE } from '../providers';

export const injectRenderer2 = (): Renderer2 => inject(RendererFactory2).createRenderer(null, null);
// todo:colorMode 跟随系统
@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly DARK_MODE_CLASS = 'dark-mode';

    private readonly _renderer = injectRenderer2();
    private readonly _document = inject(DOCUMENT);
    private readonly _preferredColorMode = inject(PREFERRED_COLOR_MODE);
    private readonly _colorMode = linkedSignal(() => this._preferredColorMode());
    readonly colorMode = this._colorMode.asReadonly();
    readonly isDarkMode = computed(() => this.colorMode() === 'dark');

    constructor() {
        effect(() => {
            this._applyDarkModeClass(this.isDarkMode());
        });
    }

    toggleDarkMode(): void {
        this._colorMode.update((mode) => (mode === 'light' ? 'dark' : 'light'));
    }

    setDarkMode(enabled: boolean): void {
        this._colorMode.set(enabled ? 'dark' : 'light');
    }

    private _applyDarkModeClass(enabled: boolean): void {
        if (enabled) {
            this._renderer.addClass(this._document.body, this.DARK_MODE_CLASS);
        } else {
            this._renderer.removeClass(this._document.body, this.DARK_MODE_CLASS);
        }
    }
}
