import { Component, HostListener } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { SignalrService } from '../../pages/service/signalr.service';
import { ToastModule } from 'primeng/toast';
import { MatBadgeModule } from '@angular/material/badge';
import { Location } from '@angular/common';
@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, ToastModule, MatBadgeModule],
    providers: [MessageService],
    template: `
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
          
           <!-- زر الرجوع -->
            <button
                type="button"
                class="layout-topbar-action back-button"
                (click)="goBack()"
                pTooltip="رجوع"
                tooltipPosition="bottom"
            >
                <i class="pi pi-arrow-left"></i>
            </button>
            
            <!-- <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
             -->

            <a class="layout-topbar-logo" routerLink="/pages/teachers">
                <!-- <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                </svg> -->
                <span style="width: max-content;">What Ever U want ⚡💪</span>
            </a>
             
        </div>

        <div class="layout-topbar-actions">
            

            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button #notificationsButton type="button"
                     mat-raised-button matBadgeSize="medium" [matBadge]="notificationCount" 
                     [matBadgeHidden]="notificationCount === 0" (click)="toggleNotifications($event)">
                        <i class="pi pi-bell"></i>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user" routerLink="/profile"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div> 
    <p-toast></p-toast>
    <div *ngIf="showMessages" class="messages-modal" #messagesModal>
        <div *ngFor="let msg of messages" class="message-item">
            {{ msg }}
        </div>
    </div>
    `,
    styles: [
        `
        .back-button {
    margin-right: 1.5rem;
    background-color: var(--primary-color, #2563eb);
    color: white;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
}

.back-button:hover {
    background-color: var(--primary-color-hover, #1d4ed8);
}
        .pill-notification {
            position: absolute;
            top: -5px;
            right: -5px;
            min-width: 20px;
            height: 20px;
            padding: 0 5px;
            border-radius: 10px;
            background-color: #ff0000;
            color: white;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-weight: bold;
            line-height: 1;
            box-shadow: 0 0 0 2px var(--surface-a);
        }

        .notification-button {
            position: relative;
        }

        .messages-modal {
            position: absolute;
            top: 50px;
            right: 20px;
            width: 200px;
            background-color: white;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            color:red;
        }
        
        .message-item {
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        `
    ]
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
        private location: Location
    ) { }

    ngOnInit(): void {
        this.signalRService.message$.subscribe((message) => {
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

    goBack() {
        this.location.back();
    }
}