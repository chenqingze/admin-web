import { DestroyRef, inject, InjectionToken, Signal, signal } from '@angular/core';
import { ColorMode } from '../models';

export const PREFERRED_COLOR_MODE = new InjectionToken<Signal<ColorMode>>('PREFERRED_COLOR_MODE', {
    providedIn: 'root',
    factory: () => {
        const destroyRef = inject(DestroyRef);
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const colorMode = signal<ColorMode>(mediaQuery.matches ? 'dark' : 'light');

        const colorSchemeChangeListener = (event: MediaQueryListEvent): void =>
            event.matches ? colorMode.set('dark') : colorMode.set('light');

        mediaQuery.addEventListener('change', colorSchemeChangeListener);

        destroyRef.onDestroy(() => mediaQuery.removeEventListener('change', colorSchemeChangeListener));

        return colorMode;
    },
});
