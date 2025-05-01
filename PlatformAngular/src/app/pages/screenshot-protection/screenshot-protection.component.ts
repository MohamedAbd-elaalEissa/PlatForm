import { CommonModule } from '@angular/common';
import { Component,HostListener,OnInit} from '@angular/core';

@Component({
  selector: 'app-screenshot-protection',
  imports: [CommonModule],
  templateUrl: './screenshot-protection.component.html',
  styleUrl: './screenshot-protection.component.scss'
})
export class ScreenshotProtectionComponent implements OnInit {
  isScreenObscured = false;

  ngOnInit() {
    // Attempt to detect screen capture (limited support)
    this.detectScreenCapture();
  }

  // Listen for window blur event (e.g., when user switches to screenshot tool)
  @HostListener('window:blur')
  onWindowBlur() {
    this.isScreenObscured = true;
    // Revert after a short delay (adjust as needed)
    setTimeout(() => {
      this.isScreenObscured = false;
    }, 1000);
  }

  // Listen for keydown events (e.g., PrintScreen key)
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'PrintScreen') {
      this.isScreenObscured = true;
      setTimeout(() => {
        this.isScreenObscured = false;
      }, 1000);
    }
  }

  // Attempt to detect screen capture using Screen Capture API
  private detectScreenCapture() {
    if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
      // Note: This is limited; browsers don't notify when capture starts
      console.log('Screen Capture API is available, but detection is limited.');
      // You can prompt for screen capture to check if it's active
      navigator.mediaDevices.getDisplayMedia({ video: true }).then(
        (stream) => {
          this.isScreenObscured = true;
          console.log('Screen capture detected.');
          // Stop the stream immediately
          stream.getTracks().forEach((track) => track.stop());
          setTimeout(() => {
            this.isScreenObscured = false;
          }, 1000);
        },
        (err) => {
          console.log('Screen capture not allowed or failed:', err);
        }
      );
    }
  }
}
