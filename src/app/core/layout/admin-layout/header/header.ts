import { Component, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'sa-header',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './header.html',
    styleUrl: './header.scss',
})
export class Header {
    toggleMenuBtn = output();
}
