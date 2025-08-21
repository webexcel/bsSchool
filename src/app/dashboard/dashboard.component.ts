import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Market } from '@ionic-native/market/ngx';
import {
  AlertController,
  AnimationController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../environments/environment';
import { FilesService } from '../service/files.service';

import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';
import { GestureController } from '@ionic/angular';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { AuthService } from '../service/auth.service';
import { DataService } from '../service/data.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';
// import { File } from "@ionic-native/file/ngx";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {
      provide: CarouselConfig,
      useValue: { interval: 1500, noPause: true, showIndicators: true },
    },
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  ios: any = false;
  go_circulars: any;
  @ViewChild('flash_template', { static: false }) flash_template: any;
  @ViewChild('latest_msg', { static: false }) latest_msg: any;
  getStudentDetails: any;
  mobileIDdetail: any;
  getStudentSMSDetail: any;
  flamessage: any;
  latestData: any = [];
  contact: any;
  version: any;
  CLASS_ID: any;
  ClassOrder: any;
  flashData: any[] = [];
  disabledValue: boolean = false;
  disabledValue1: boolean = false;
  modalRef?: BsModalRef;
  flashindex: any = 0;
  public appPages: any[] = environment.pages;
  feetext: any = '';
  s: any = 0;
  sc: any = false;
  sineter: any;
  // @ViewChild('modal') modal;
  isModalOpen: boolean = false;
  isModalOpen2: boolean = false;
  isModal2Open: boolean = false;
  sBirthDate: any;
  fBirthDate: any;
  dayString: any;
  monthString: any;
  today: any;
  month: number;
  profileDetails: boolean = false;
  profileData: any[] = [];

  constructor(
    private gestureCtrl: GestureController,
    private iab: InAppBrowser,
    private market: Market,
    private dataservice: DataService,
    private platform: Platform,
    private appMinimize: AppMinimize,
    private translate: TranslateConfigService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    public authservice: AuthService,
    public storage: StorageService,
    private serfile: FilesService,
    private animationCtrl: AnimationController,
    private alertCtrl: AlertController,
    public modal: ModalController
  ) {
    this.platform.backButton.subscribe(() => {
      let p = this.storage.get('page');
      if (p == 'dashboard') {
        this.appMinimize.minimize();
      }
    });
  }

  ngOnInit() {
    const ionZoomElement = document.getElementById('image-cls');
    if (ionZoomElement) {
      const gesture = this.gestureCtrl.create({
        el: ionZoomElement,
        gestureName: 'zoom',
        threshold: 0,
        onStart: (ev) => {},
        onMove: (ev) => {},
        onEnd: (ev) => {},
      });

      gesture.enable();
    }
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.ios = this.authservice.isiso();
    this.dataservice.currentMenustatus.subscribe((index: any) => {
      this.translate.set();
    });
    this.getStudentDetails = this.storage.getjson('studentDetail');
    this.version = environment.version;
    this.mobileIDdetail = this.storage.get('mobileid');
    this.getStudentSMSDetail = this.storage.getjson('studentDetail');
    this.contact = this.getStudentDetails[0].contact;
    this.CLASS_ID = this.getStudentDetails[0].CLASS_ID;
    this.ClassOrder = this.getStudentDetails[0].ClassOrder;
    //this.feesflash()
    this.flashindex = 0;
    let f = this.storage.get('first');
    if (f == '1') {
      this.flashmessage(this.CLASS_ID);
    }
    this.sineter = setInterval(() => {
      this.chan();
    }, 5000);

    let url: any = 'http://sms.schooltree.in/uploads/demosch/8/956nb2.PNG';

    this.dayString = new Date().getDate().toString().padStart(2, '0');
    this.month = new Date().getMonth() + 1;
    this.monthString = this.month.toString().padStart(2, '0');
    this.today = `${this.dayString}-${this.monthString}`;

    this.dob();
  }

  ionViewWillEnter() {
    for (let i = 0; i < this.getStudentDetails.length; i++) {
      this.getStudentDetails[i]['feesPending'] = false;
      this.getStudentDetails[i]['balance'] = 0;
    }
    // this.checkFeesBalance();
    // this.batchCount();
  }

  ngOnDestroy(): void {
    this.storage.add('first', '1');
    clearInterval(this.sineter);
  }

  dob() {
    for (let i = 0; i < this.getStudentDetails.length; i++) {
      this.sBirthDate = this.getStudentDetails[i].dob;
      this.fBirthDate = this.sBirthDate
        ?.split('-')
        .reverse()
        .join('-')
        .substring(0, 5);

      if (this.fBirthDate === this.today) {
        this.openmodel2();
      }
    }
  }

  latestmessage(mobileNumber: any) {
    let latestMes;
    let detail = { mobile_number: mobileNumber };
    this.flashData = [];
    this.authservice.post('latestmessage', detail).subscribe(
      (result: any) => {
        latestMes = result;
        if (latestMes.status) {
          this.disabledValue1 = false;
          this.latestData = latestMes.data;
          if (this.latestData.length > 0) {
            this.storage.add('latest_msg', '2');

            this.isModal2Open = !this.isModal2Open;
          }
        } else {
          this.disabledValue1 = true;
        }
      },
      (err) => {
        //Connection failed message
      }
    );
  }

  openmodel() {
    this.isModalOpen = !this.isModalOpen;
  }

  openmodel2() {
    this.isModalOpen2 = !this.isModalOpen2;
  }

  // openmodel(isBirthday: boolean = false) {
  //   this.isModalOpen = true;
  //   if (isBirthday) {
  //     alert('Happy Birthday!');
  //     // Here, you could display a modal with a birthday message or some other UI element.
  //   }
  // }

  close2() {
    this.isModalOpen2 = !this.isModalOpen2;
    // this.openmodel2();
  }

  close() {
    this.flashindex = this.flashindex + 1;
    this.isModalOpen = !this.isModalOpen;
    this.openmodel();
  }

  // flashmessage(mobileNumber: any) {
  //   let flashmes;
  //   let detail = { mobile_number: mobileNumber, version: this.version };
  //   this.flashData = [];
  //   this.authservice.post('getflashmessage', detail).subscribe(
  //     (result: any) => {
  //       flashmes = result;

  //       if (flashmes.status) {
  //         this.disabledValue = false;
  //         this.flashData = flashmes.data;
  //         for (let i = 0; i < this.flashData.length; i++) {
  //           this.flashData[i].Discription = this.authservice.extractUrl(
  //             this.flashData[i].Discription
  //           );
  //         }
  //         this.flashindex = 0;
  //         if (this.flashData[0].Title != 'Update') {
  //           this.openmodel();
  //         }
  //         if (parseInt(this.flashData[0].version_code) > this.version) {
  //           this.updateandrod();
  //         } else {
  //           if (this.flashData[0].Title === 'Update') {
  //             this.disabledValue = true;
  //           } else {
  //             this.disabledValue = false;
  //           }
  //         }
  //       } else {
  //         this.disabledValue = true;
  //         this.storage.add('flash_close', 'ok');
  //         this.openmodel();
  //       }
  //     },
  //     (err) => {
  //       this.storage.add('flash_close', 'ok');
  //       this.openmodel();
  //     }
  //   );
  // }

  flashmessage(mobileNumber: any) {
    let flashmes;
    let detail = { mobile_number: mobileNumber, version: this.version };
    this.flashData = [];
    this.authservice.post('getflashmessage', detail).subscribe(
      (result: any) => {
        flashmes = result;
        if (flashmes.status) {
          //this.disabledValue = false;
          this.flashData =
            flashmes.data == undefined || flashmes.data == ''
              ? []
              : flashmes.data;

          for (let i = 0; i < this.flashData.length; i++) {
            this.flashData[i].Discription = this.authservice.extractUrl(
              this.flashData[i].Discription
            );
          }

          if (parseInt(this.flashData[0].version_code) > this.version) {
            this.updateandrod();
          }

          this.flashindex = 0;
          if (this.flashData[0].Title != 'Update') {
            this.openmodel();
          } else {
            if (this.flashData[0].Title === 'Update') {
              this.flashData.splice(0, 1);
              // this.disabledValue = true;
            }
            this.openmodel();
            //else {
            //   this.disabledValue = false;
            // }
          }
        } else {
          //this.disabledValue = true;
          this.storage.add('flash_close', 'ok');
          this.openmodel();
        }
      },
      (err) => {
        this.storage.add('flash_close', 'ok');
        this.openmodel();
        //Connection failed message
      }
    );
  }

  go(url: any) {
    this.router.navigate([url]);
  }

  feesflash() {
    let adno = [];
    for (let i = 0; i < this.getStudentSMSDetail.length; i++) {
      adno.push(this.getStudentSMSDetail[i]['ADNO']);
    }

    this.authservice.post('feesflash', { adno: adno }).subscribe(
      (result: any) => {
        if (result['status']) {
          this.feetext = result['message'];
        }
      },
      (err) => {}
    );
  }
  chan() {
    if (this.sc) {
      this.sc = false;
    } else {
      this.sc = true;
    }

    if (this.getStudentDetails.length - 1 == this.s) {
      this.s = 0;
    } else {
      this.s = this.s + 1;
    }
  }
  updateandrod() {
    this.storage.clear();
    if (!this.authservice.isiso()) {
      const options: InAppBrowserOptions = {
        zoom: 'no',
      };
      const browser = this.iab.create(
        'https://play.google.com/store/apps/details?id=' + environment.package,
        '_system',
        options
      );
      browser.on('loadstart');
    }
  }

  pay() {
    const options: InAppBrowserOptions = {
      zoom: 'no',
    };
    const browser = this.iab.create(
      'http://schooltree.in/',
      '_system',
      options
    );
    browser.on('loadstart');
  }
  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;
    if (root !== null) {
      var backdropAnimation: any;
      backdropAnimation = this.animationCtrl
        .create()
        .addElement(root.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
    }
    if (root !== null) {
      var wrapperAnimation: any;
      wrapperAnimation = this.animationCtrl
        .create()
        .addElement(root.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' },
        ]);
    }

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  checkFeesBalance() {
    let adno = this.storage.getjson('studentDetail');
    let admNo = [];

    if (adno.length > 1) {
      for (let i = 0; i < adno.length; i++) {
        admNo.push(adno[i].ADNO);
      }
    } else {
      admNo.push(adno[0].ADNO);
    }

    if (adno[0] != undefined && adno[0].ADNO != undefined) {
      this.authservice.post('checkFeesBalance', { adno: admNo }).subscribe(
        (result: any) => {
          if (result.status || result.STATUS) {
            for (let i = 0; i < result.data.length; i++) {
              let fee = 0;
              for (let j = 0; j < result.data[i].length; j++) {
                if (parseFloat(result.data[i][j].Balance_Amount) > 0) {
                  fee += parseFloat(result.data[i][j].Balance_Amount);
                }
              }
              if (fee > 0) {
                this.getStudentDetails[i]['feesPending'] = true;
                this.getStudentDetails[i]['balance'] = fee;
              }
            }
          } else {
            for (let i = 0; i < this.getStudentDetails.length; i++) {
              this.getStudentDetails[i]['feesPending'] = false;
              this.getStudentDetails[i]['balance'] = 0;
            }
          }
        },
        (err: any) => {
          for (let i = 0; i < this.getStudentDetails.length; i++) {
            this.getStudentDetails[i]['feesPending'] = false;
            this.getStudentDetails[i]['balance'] = 0;
          }
        }
      );
    } else {
      for (let i = 0; i < this.getStudentDetails.length; i++) {
        this.getStudentDetails[i]['feesPending'] = false;
        this.getStudentDetails[i]['balance'] = 0;
      }
    }
  }

  redirectToFees() {
    this.router.navigate(['/payment']);
  }

  batchCount() {
    this.authservice
      .post('batchCount', { mobile_number: this.contact })
      .subscribe(
        (res: any) => {
          let resData = res['data'];
          this.appPages.forEach((page: any) => {
            const key = page.title;
            if (resData[key]) {
              page['notifyCount'] = parseInt(
                resData[key][0][`${key[0]}_count`] || '0',
                10
              );
            } else {
              page['notifyCount'] = 0;
            }
          });
        },
        (err) => {}
      );
  }

  get() {
    this.authservice
      .post('getIdcard', { adno: '9617,9478' })
      .subscribe((result: any) => {
        this.profileData = result['data'];
        this.profileDetails = true;
        console.log(this.profileData);
      });
  }

  closeProfile() {
    this.profileDetails = false;
    this.modal.dismiss();
  }
}
