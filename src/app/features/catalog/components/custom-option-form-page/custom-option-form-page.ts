import { Component } from '@angular/core';
import { PageHeader } from '@components';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-custom-option-form-page',
    imports: [PageHeader, MatCardModule],
    templateUrl: './custom-option-form-page.html',
    styleUrl: './custom-option-form-page.scss',
})
export class CustomOptionFormPage {}
