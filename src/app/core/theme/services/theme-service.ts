import { DOCUMENT, effect, inject, Injectable, linkedSignal, Renderer2, RendererFactory2, signal } from '@angular/core';
import { PREFERS_COLOR_SCHEME } from '../providers';
import { ColorMode } from '../models';

export const injectRenderer2 = (): Renderer2 => inject(RendererFactory2).createRenderer(null, null);
// todo:colorMode 跟随系统
@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    readonly DARK_MODE_CLASS = 'dark-mode';
    private readonly LOCAL_STORAGE_COLOR_MODE_KEY: string = '_color_mode';

    private readonly renderer = injectRenderer2();
    private readonly document = inject(DOCUMENT);
    private readonly prefersColorScheme = inject(PREFERS_COLOR_SCHEME);
    private readonly colorScheme = linkedSignal(() => this.prefersColorScheme()).asReadonly();
    private readonly colorMode = signal<ColorMode>(
        (localStorage.getItem(this.LOCAL_STORAGE_COLOR_MODE_KEY) || 'system') as ColorMode,
    );
    readonly currentColorMode = this.colorMode.asReadonly();

    constructor() {
        effect(() => {
            localStorage.setItem(this.LOCAL_STORAGE_COLOR_MODE_KEY, this.currentColorMode());
            this.applyDarkModeClass(this.getCurrentColorScheme() === 'dark');
        });
    }

    setColorMode(mode: ColorMode) {
        this.colorMode.set(mode);
    }

    private getCurrentColorScheme() {
        switch (this.currentColorMode()) {
            case 'dark':
                return 'dark';
            case 'light':
                return 'light';
            case 'system':
            default:
                return this.colorScheme();
        }
    }

    private applyDarkModeClass(isDarkModeEnable: boolean): void {
        if (isDarkModeEnable) {
            this.renderer.addClass(this.document.body, this.DARK_MODE_CLASS);
        } else {
            this.renderer.removeClass(this.document.body, this.DARK_MODE_CLASS);
        }
    }
}
