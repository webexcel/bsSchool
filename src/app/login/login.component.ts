import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { DataService } from '../service/data.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  logo: any = environment.login_logo;
  school_name: any = environment.school_name;
  authForm: any = {};
  app_versionCode: any = environment.app_versionCode;
  mobilNumber: any;
  values: any;
  getLoginValue: any;
  myData: any;
  storeFirBaseStatus: any;
  getStudentDetails: any;
  enter_registered_mobile_number: any;
  enter_admission_number: any;
  cancel: any;
  validate: any;

  constructor(
    private platform: Platform,
    private appMinimize: AppMinimize,
    public loading: LoadingService,
    private translate: TranslateConfigService,
    private dataservice: DataService,
    private router: Router,
    private route: ActivatedRoute,
    public authservice: AuthService,
    public storage: StorageService,
    private alertCtrl: AlertController
  ) {
    this.platform.backButton.subscribe(() => {
      let p = this.storage.get('page');
      if (p == 'login') {
        this.appMinimize.minimize();
      }
    });
  }

  ngOnInit() {
    this.translate.set();
    this.translate
      .getparam('enter_registered_mobile_number')
      .then((v) => (this.enter_registered_mobile_number = v));
    this.translate
      .getparam('enter_admission_number')
      .then((v) => (this.enter_admission_number = v));
    this.translate.getparam('cancel').then((v) => (this.cancel = v));
    this.translate.getparam('validate').then((v) => (this.validate = v));
    this.storage.add('first', '2');
  }

  phonedata(data: any) {
    return (data.target.value = data.target.value
      .replace(/[^0-9.]/g, '')
      .slice(0, 10));
  }

  replaceholder(t: any) {
    t.target.placeholder = this.enter_registered_mobile_number;
  }

  async submitForm() {
    this.loading.present();
    this.app_versionCode = environment.app_versionCode;
    this.mobilNumber = this.authForm.username;
    const info = await Device.getInfo();
    let value: any = {
      platform_type: 'Android',
      manufacturer_name: info.manufacturer,
      manufacturer_model: info.model,
      os_version: info.osVersion,
      deviceid: await Device.getId(),
      mobile_no: this.mobilNumber,
      app_version_code: this.app_versionCode,
    };
    this.authservice.post('mobileinstallsnew', value).subscribe(
      (result) => {
        this.getLoginValue = result;
        this.myData = this.getLoginValue.data;
        if (this.getLoginValue.status == true) {
          this.storage.add('mobileid', this.myData.id);
          this.storage.add('otp', this.myData.sname);
          this.checkOTPAndIDLogin(this.myData.sname);
        } else {
        }
        this.loading.dismissAll();
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  async checkOTPAndIDLogin(sname: any) {
    let alert = await this.alertCtrl.create({
      header: this.enter_admission_number + sname,
      inputs: [
        {
          name: 'OTP',

          type: 'password',
        },
      ],
      buttons: [
        {
          text: this.cancel,
          role: 'cancel',
        },
        {
          text: this.validate,
          handler: (data) => {
            this.sendOTPandID(data, sname);
          },
        },
      ],
    });
    await alert.present();
  }

  updateFireBaseID() {
    let fireBaseIDValues = this.storage.get('fireBaseID');
    let sendingValue = {
      firebase_id: fireBaseIDValues,
      mobile_no: this.mobilNumber,
    };
    this.authservice.post('updateFirebaseId', sendingValue).subscribe(
      (result) => {
        let fireBaseResponse = result;
        this.storeFirBaseStatus = fireBaseResponse;
        if (this.storeFirBaseStatus.status) {
          this.sendMobStudentDetailID();
        } else {
          this.loading.dismissAll();
          this.openalert('FIRE BASE ALERT', this.storeFirBaseStatus.data);
        }
      },
      (err) => {
        this.loading.dismissAll();
        //Connection failed message
      }
    );
  }

  async openalert(message: any, title = 'ALERT') {
    let alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  sendOTPandID(data: any, sname: any) {
    // this.loading.present();
    let sendingValue = { id: this.myData.id, otp: data.OTP };
    this.authservice.post('mobileInstallerVerify', sendingValue).subscribe(
      (result: any) => {
        this.getLoginValue = result;
        if (this.getLoginValue.status == true) {
          this.updateFireBaseID();
        } else {
          this.show(result['message'], sname);
        }
        // this.loading.dismissAll();
      },
      (err) => {
        // this.loading.dismissAll();
        //Connection failed message
      }
    );
  }

  sendMobStudentDetailID() {
    let mobileDetailsID = { id: this.myData.id, ver: this.app_versionCode };
    this.authservice.post('getMobStudentDetail', mobileDetailsID).subscribe(
      (result) => {
        let storeStudentDetail = result;
        this.getStudentDetails = storeStudentDetail;
        if (this.getStudentDetails.status == true) {
          this.getimage(0);
        } else {
          this.loading.dismissAll();
        }
      },
      (err) => {
        this.loading.dismissAll();
        //Connection failed message
      }
    );
  }

  getimage(i: any) {
    if (i > this.getStudentDetails.data.length - 1) {
      this.storage.addjson('studentDetail', this.getStudentDetails.data);
      this.dataservice.changeMenustatus(true);
      this.storage.addjson('flashmsg', { Discription: '', event_image: '' });
      this.loading.dismissAll();
      this.router.navigate(['']);
    } else {
      if (this.getStudentDetails.data[i]['ADNO'] != undefined) {
        this.authservice
          .post('getMobStudentPhoto', {
            adno: this.getStudentDetails.data[i]['ADNO'],
          })
          .subscribe(
            (result: any) => {
              if (result['status']) {
                if (result['data'] != 'data:image/jpg;base64,') {
                  this.storage.add(
                    this.getStudentDetails.data[i]['ADNO'] + 'img',
                    result['data']
                  );
                  // this.getStudentDetails.data[i]["stu_img"] = result['data']
                }
                this.getimage(i + 1);
              }
            },
            (err) => {
              this.loading.dismissAll();
            }
          );
      } else {
        this.getimage(i + 1);
      }
    }
  }

  async show(msg: any, sname: any) {
    let alert = await this.alertCtrl.create({
      header: msg,
      buttons: [
        {
          text: 'Retry!',
          role: 'cancel',
          handler: (data) => {
            this.checkOTPAndIDLogin(sname);
          },
        },
      ],
    });
    await alert.present();
  }
}
