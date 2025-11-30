import { Component, DOCUMENT, inject, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../theme/services';
import { MatMenuModule } from '@angular/material/menu';
import { ColorMode } from '../../../theme/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'app-header',
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatMenuModule,
        MatFormFieldModule,
        MatRadioModule,
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    private readonly document = inject(DOCUMENT);
    readonly toggleNavigation = output();
    private readonly themeService = inject(ThemeService);
    protected readonly currentColorMode = this.themeService.currentColorMode;

    setColorMode(mode: ColorMode) {
        this.themeService.setColorMode(mode);
    }

    toggleFullscreen() {
        this.document.querySelector('.layout__main')?.requestFullscreen();
    }
}
