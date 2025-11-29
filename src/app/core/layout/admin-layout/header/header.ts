import { Component, DOCUMENT, inject, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../theme/services';
import { MatMenuModule } from '@angular/material/menu';
import { ColorMode } from '../../../theme/models';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule, MatMenuModule],
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
