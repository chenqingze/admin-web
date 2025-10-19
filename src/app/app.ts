import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@env/environment.development';

@Component({
    selector: 'sa-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal(environment.appName);
}
