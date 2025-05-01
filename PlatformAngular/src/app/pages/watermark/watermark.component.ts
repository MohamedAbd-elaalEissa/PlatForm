import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-watermark',
  imports: [CommonModule],
  templateUrl: './watermark.component.html',
  styleUrl: './watermark.component.scss'
})
export class WatermarkComponent {
  watermarkText = "Confidential - Watermarked";
  showWatermark = true;
}
