import { Component, HostListener, NgZone } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { ToastModule } from 'primeng/toast';
import { MatBadgeModule } from '@angular/material/badge';
import { LayoutService } from '../../service/layout.service';
import { SignalrService } from '../../../pages/service/signalr.service';
import { AppConfigurator } from '../app.configurator';
import { AuthService } from '../../../pages/service/auth.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, ToastModule, MatBadgeModule , BreadcrumbComponent,BreadcrumbModule],
  providers: [MessageService],
  templateUrl: './app-topbar.component.html',
  styleUrl: './app-topbar.component.scss'
})
export class AppTopbar {
  latestMessage: string = '';
  items!: MenuItem[];
  notificationCount: number = 0;
  showMessages: boolean = false;
  messages: string[] = [];

  constructor(
    public layoutService: LayoutService,
    private signalRService: SignalrService,
    private toastService: MessageService,
    private authservice: AuthService,
    private zone: NgZone  // <-- Inject NgZone

  ) { }

  ngOnInit(): void {
    this.signalRService.message$.subscribe((message) => {
      this.zone.run(() => {  // <-- Ensure UI update inside Angular zone
        this.latestMessage = message;
        if (this.latestMessage)
          this.notificationCount++;
        this.messages.push(message);
        if (this.latestMessage) {
          this.toastService.add({
            severity: 'info',
            summary: 'New Message',
            detail: this.latestMessage
          });
        }
      });
    });

  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const messagesModal = document.querySelector('.messages-modal');
    const notificationsButton = document.querySelector('[matbadge]');

    if (this.showMessages &&
      !notificationsButton?.contains(event.target as Node) &&
      !messagesModal?.contains(event.target as Node)) {
      this.showMessages = false;
    }
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  toggleNotifications(event: Event) {
    event.stopPropagation(); // Prevent the click from reaching the document listener immediately
    this.showMessages = !this.showMessages;
    if (this.showMessages) {
      this.notificationCount = 0; // Reset the count when viewing notifications
    }
  }



  logout() {
    this.authservice.logout();
  }
}
