import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LottieComponent, AnimationOptions, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

@Component({
  selector: 'app-lottie-loader',
 templateUrl: './lottie-loader.component.html',
  styleUrl: './lottie-loader.component.scss',
  standalone: true,
  imports: [CommonModule, LottieComponent],
  providers: [
    provideLottieOptions({ player: () => player })
  ],
})
export class LottieLoaderComponent implements OnInit {
  @Input() show = false;
  @Input() path: string = 'assets/Loader/Loader.json';
  @Input() width: string = '350px';
  @Input() height: string = '350px';

  options!: AnimationOptions;

  ngOnInit(): void {
    this.options = {
      path: this.path,
      loop: true,
      autoplay: true,
    };
  }
}
