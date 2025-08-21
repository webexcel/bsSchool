import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AlertController, ToastController } from '@ionic/angular';

import { Observable, fromEvent, merge, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { TranslateConfigService } from './translate-config.service';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  cancel: any;
  public appIsOnline$: any = Observable<boolean>;
  constructor(
    public alertCtrl: AlertController,
    private translate: TranslateConfigService, public toastController: ToastController
  ) {
    this.translate.getparam('cancel').then((v: any) => (this.cancel = v));
    this.initConnectivityMonitoring();
  }

  private initConnectivityMonitoring() {
    if (!window || !navigator || !('onLine' in navigator)) return;

    this.appIsOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let u: any = request.url;
    if (u) {
      u = u.split('api/');
      if (u.length == 2) {
        u = u[1];
      }
    }

    return next.handle(request).pipe(
      tap(
        (r: any) => {
          r = r['body'];
          try {
            if (r['status'] !== undefined) {
              if (!r['status']) {
                if (
                  u != 'getflashmessage' &&
                  u != 'latestmessage' &&
                  u != 'mobileInstallerVerify'
                ) {
                  this.getmsg(r);
                }
              }
            }
          } catch (error) {
            try {
              if (r['STATUS'] != undefined) {
                if (!r['STATUS']) {
                  if (
                    u != 'getflashmessage' &&
                    u != 'latestmessage' &&
                    u != 'mobileInstallerVerify'
                  ) {
                    this.getmsg(r);
                  }
                }
              }
            } catch (error) {}
          }

          // if(result['body'] != undefined){
          //     if(result['body']['statusCode'] != undefined){
          //         if(result['body']['statusCode']!=200 && result['body']['statusCode']!=100){
          //             if(result['body']['message']!=undefined){

          //             }
          //         }
          //     }
          // }
        },
        (error) => {
          if (error['statusText'] == 'Unknown Error') {
            this.appIsOnline$.subscribe((res: any) => {
              if (!res) {
                this.show('Please Check Your Internet Connection');
              } else {
                this.show('Oops!! Something went wrong');
              }
            });
          } else {
            if (error["status"] == 200 && error["ok"]== false && error.error.text.includes("404 Not Found")) {
              this.show("API Doesn't Exist");
            } else if (error["status"] == 200 && error["ok"]== false && error.error.text.includes("QUERY:")) {
              this.show("Database Error Exist");
            } else {
              this.show('Contact Support Team');
            }
          }
        }
      ),
      finalize(() => {})
    );
  }

  getmsg(r: any) {
    if (r['message'] != undefined) {
      this.show(r['message']);
    }
    if (r['MESSAGE'] != undefined) {
      this.show(r['MESSAGE']);
    }
  }

  async show(msg: any) {
    if (msg.includes("Contact Support") || msg == "API Doesn't Exist" || msg == "Database Error Exist") {
      const toast = await this.toastController.create({
        message: msg + "!!",
        duration: 2000,
        color: "danger",
        position: 'middle',
        cssClass: 'custom-toast'
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: msg,
        duration: 2000,
        color: "success",
        position: 'middle',
        cssClass: 'custom-toast'
      });
      toast.present();
    }
  }
}
