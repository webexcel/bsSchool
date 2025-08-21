import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Badge } from '@ionic-native/badge/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AlertController } from '@ionic/angular';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  token: any;
  public fireBaseRegistrationID: any;
  public badgeNumber: any = 0;
  constructor(
    private storage: StorageService,
    public router: Router,
    private badge: Badge,
    private nativeAudio: NativeAudio,
    public alertCtrl: AlertController
  ) {}
  initPush() {
    this.badge.set(this.badgeNumber);
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive === 'granted') {
        PushNotifications.register();
      } else {
        // If permission is not granted
      }
    });

    PushNotifications.addListener('registration', (token) => {
      this.storage.add('push1', 'ok1');
      this.fireBaseRegistrationID = token.value;
      //TODO - save in local storage
      this.storage.add('fireBaseID', this.fireBaseRegistrationID);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        this.badgeNumber++;
        this.badge.set(this.badgeNumber);
        this.badge.increase(1).catch((err) =>
          console.error('Error updating badge count', err)
        );
        if (notification.data.foreground) {
          this.badge.set(this.badgeNumber);
          this.alertopen(notification);
          this.nativeAudio.play('uniqueId1').catch((err) =>
            console.error('Audio playback failed', err)
          );
        } else {
          this.alertopen(notification);
        }
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: any) => {}
    );

    PushNotifications.addListener('registrationError', (error: any) => {});
  }

  async alertopen(notification: any) {
    let confirmAlert = await this.alertCtrl.create({
      header: 'New Notification',
      message: notification.additionalData.id,
      buttons: [
        {
          text: 'Ignore',
          role: 'cancel',
          handler: () => {
            this.badge.decrease(1).then(
              () => {
                if (this.badgeNumber > 0) {
                  this.badgeNumber--; 
                }
              },
              (err) => console.error('Failed to decrease badge count', err)
            );
          },
        },
        {
          text: 'View',
          handler: () => {
            this.badge.clear().then(
              () => {
                this.badgeNumber = 0;
              },
              (err) => console.error('Failed to clear badge count', err)
            );
            this.router.navigate(['circulars']);
          },
        },
      ],
    });
    confirmAlert.present();
  }
}
