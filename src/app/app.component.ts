import { Component } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { NotificationsService } from './service/notifications.service';
import { StorageService } from './service/storage.service';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Router } from '@angular/router';
import { Badge } from '@ionic-native/badge/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AlertController } from '@ionic/angular';
import { setTheme } from 'ngx-bootstrap/utils';
import { environment } from '../environments/environment';
import { DataService } from './service/data.service';

import { register } from 'swiper/element/bundle';
import { AuthService } from './service/auth.service';
import { FilesService } from './service/files.service';
import { LoadingService } from './service/loading.service';
import { TranslateConfigService } from './service/translate-config.service';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  token: any;
  ios: any = false;
  public fireBaseRegistrationID: any;
  public getStudentDetails: any = [];
  public app_versionCode: any;
  public storeValues: any;
  public sName: any;
  public badgeNumber: any;
  public disPlayStudentDetail: any = [];
  public index: any = false;
  public appPages = environment.pages;
  loadingconfig: any = {
    bgsColor: environment.color,
    bgsOpacity: 0.5,
    bgsPosition: 'bottom-right',
    bgsSize: 60,
    bgsType: 'ball-spin-clockwise',
    blur: 5,
    delay: 0,
    fastFadeOut: true,
    fgsColor: environment.color,
    fgsPosition: 'center-center',
    fgsSize: 60,
    fgsType: 'cube-grid',
    gap: 24,
    logoPosition: 'center-center',
    logoSize: 120,
    logoUrl: '',
    masterLoaderId: 'master',
    overlayBorderRadius: '0',
    overlayColor: 'rgba(40, 40, 40, 0.8)',
    pbColor: environment.color,
    pbDirection: 'ltr',
    pbThickness: 3,
    hasProgressBar: false,
    text: 'Please wait',
    textColor: '#FFFFFF',
    textPosition: 'center-center',
    maxTime: -1,
    minTime: 300,
  };
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    public notif: NotificationsService,
    private nativeAudio: NativeAudio,
    private translate: TranslateConfigService,
    private dataservice: DataService,
    public router: Router,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private appMinimize: AppMinimize,
    private badge: Badge,
    // private push: Push,
    public alertCtrl: AlertController,
    private storage: StorageService,
    private loading: LoadingService,
    public authservice: AuthService,
    private serfile: FilesService
  ) {
    // this.notif.initPush();
    // this.token = this.notif.token;
    setTheme('bs4');
    router.events.subscribe((val) => {
      this.storage.remove('page');
      switch (router.url.replace('/', '')) {
        case 'dashboard':
          this.storage.addjson('flashmsg', {});
          this.storage.add('latest_msg', '1');
          this.storage.add('page', 'dashboard');
          break;
        case 'login':
          this.storage.add('page', 'login');
          break;
        case 'gallery':
          this.storage.add('page', 'gallery');
          break;
        default:
          this.storage.remove('page');
      }
    });
    // this.platform.backButton.subscribe(() => {
    //   this.appMinimize.minimize();
    // })

    this.initializeApp();
  }
  ngOnInit() {}
  async copyToClipboard(text: string) {
    try {
      await Clipboard.write({ string: text });
      alert('copied');
    } catch (error) {
      console.error('Error copying text:', error);
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushSetup();
      this.requestPermission();
      this.badge.set(this.badgeNumber);
      this.ios = this.authservice.isiso();
      this.serfile.checkdir();
    });

    this.dataservice.currentMenustatus.subscribe((index) => {
      this.index = index;
      this.translate.set();
      this.translate
        .getparam('loader_msg')
        .then((v) => (this.loadingconfig.text = v));
    });

    this.disPlayStudentDetail = this.storage.getjson('studentDetail');
    if (this.disPlayStudentDetail) {
      this.dataservice.changeMenustatus(true);
    } else {
      this.dataservice.changeMenustatus(false);
    }
    this.nativeAudio.preloadSimple('uniqueId1', 'assets/deduction.mp3').then(
      (res) => {},
      (err) => {}
    );
  }
  async requestPermission() {
    try {
      let hasPermission = await this.badge.hasPermission();
      if (!hasPermission) {
        let permission = await this.badge.requestPermission();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async pushSetup() {
    this.storage.add('push', 'ok'); // this line ok
    this.notif.initPush();
  }

  async alertopen(notification: any) {
    let confirmAlert = await this.alertCtrl.create({
      header: 'New Notification',
      message: notification.additionalData.id,
      buttons: [
        {
          text: 'Ignore',
          role: 'cancel',
        },
        {
          text: 'View',
          handler: () => {
            this.router.navigate(['circulars']);
          },
        },
      ],
    });
    confirmAlert.present();
  }

  logout() {
    let laun = this.storage.get('laun');
    let fireBaseID = this.storage.get('fireBaseID');
    this.storage.clear();
    if (laun) {
      this.storage.add('laun', laun);
      this.translate.set();
    }
    this.storage.add('fireBaseID', fireBaseID);
    this.index = false;
    this.router.navigate(['login']);
  }
}
