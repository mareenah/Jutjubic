import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private client!: Client;
  private connected = false;

  connect(onConnected?: () => void) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(environment.socketHost + 'socket'),
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      console.log('STOMP connected');
      this.connected = true;

      if (onConnected) {
        onConnected();
      }
    };

    this.client.activate();
  }

  subscribeToWatchParty(partyId: string, callback: (event: any) => void) {
    if (!this.connected) {
      console.warn('STOMP not connected yet');
      return;
    }

    this.client.subscribe(`/socket-publisher/watch-party/${partyId}`, (message) => {
      callback(JSON.parse(message.body));
    });
  }

  startVideo(partyId: string, postId: string) {
    if (!this.connected) {
      console.error('Cannot publish — STOMP not connected');
      return;
    }
    this.client.publish({
      destination: '/socket-subscriber/watch-party/start',
      body: JSON.stringify({
        type: 'VIDEO_STARTED',
        partyId,
        postId,
      }),
    });
  }
}
