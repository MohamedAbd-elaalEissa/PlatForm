import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private apiUrl = environment.apiUrl;
  private hubConnection!: signalR.HubConnection;
  private messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');  // Subject to store the latest message
  message$ = this.messageSubject.asObservable();  // Observable to be used in components

  constructor() {
  }
  startConnection(email: string): void {
    debugger
    this.hubConnection = new signalR.HubConnectionBuilder()

      .withUrl(`https://identitysso-001-site1.ktempurl.com/notificationHub?email=${email}`, {
      //.withUrl(`https://localhost:44305/notificationHub?email=${email}`, {
        withCredentials: true // this matches the CORS settings on the server
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected')
        this.registerEvents();
        this.getMissedMessages(email);
      })
      .catch(err => console.error('SignalR Error: ', err));
  }
  private registerEvents() {
    this.hubConnection.on('ReceiveNotification', (message: string) => {
      debugger
      this.messageSubject.next(message);
    });
  }
  private getMissedMessages(email: string) {
    this.hubConnection.invoke('GetMissedMessages', email)
      .catch(err => console.error(err));
  }
  public stopConnection(): void {
    this.hubConnection.stop();
  }
}
