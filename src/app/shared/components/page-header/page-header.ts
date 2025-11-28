import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-page-header',
    imports: [MatCardModule],
    templateUrl: './page-header.html',
    styleUrl: './page-header.scss',
})
export class PageHeader {}
