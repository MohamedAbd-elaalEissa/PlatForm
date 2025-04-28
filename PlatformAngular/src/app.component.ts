import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignalrService } from './app/pages/service/signalr.service';
import { WatermarkComponent } from './app/pages/watermark/watermark.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, WatermarkComponent],
    template: ` 
    <app-watermark></app-watermark>
    <router-outlet></router-outlet>`
})
export class AppComponent {

    constructor(private signalRService: SignalrService) {

    }
    
    ngOnDestroy(): void {
        // Stop SignalR connection when component is destroyed
        this.signalRService.stopConnection();
    }
}
