import { DestroyRef, inject, InjectionToken, Signal, signal } from '@angular/core';
import { ColorScheme } from '../models';

export const PREFERS_COLOR_SCHEME = new InjectionToken<Signal<ColorScheme>>('PREFERS_COLOR_SCHEME', {
    providedIn: 'root',
    factory: () => {
        const destroyRef = inject(DestroyRef);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const colorScheme = signal<ColorScheme>(mediaQuery.matches ? 'dark' : 'light');

        const colorSchemeChangeListener = (event: MediaQueryListEvent): void =>
            event.matches ? colorScheme.set('dark') : colorScheme.set('light');

        mediaQuery.addEventListener('change', colorSchemeChangeListener);

        destroyRef.onDestroy(() => mediaQuery.removeEventListener('change', colorSchemeChangeListener));

        return colorScheme;
    },
});
