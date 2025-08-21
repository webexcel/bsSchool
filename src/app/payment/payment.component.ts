import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';

//import * as _ from "lodash";
//declare var RazorpayCheckout: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @ViewChild(MatAccordion, { static: false }) accordion: MatAccordion;

  ios: any = false;
  data: any;
  paymentlist: any = [];
  selectinterval: any = [];
  checkvalue: any = [];
  ADNO: any = '';
  paybutton: any = true;
  chkbox: any = true;
  paydatas: any = [];
  totalfee: any = 0;
  totalpaid: any = 0;
  asofbal: any = 0;
  name: any = '';
  cls: any = '';
  classID: any;
  razorpayload: any = {};
  contactNo: number;
  admissionID: any;
  paymentHistoryArray = [];
  recIDArray: any = [];
  paymentAmt = [];
  getStudentDetails: any;
  amount: any;
  sessionExpire: any;
  tk_type: any;
  accessTk: any;
  merId: any;
  apiBaseUrl: any = environment.apiBaseUrl;

  constructor(
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public loading: LoadingService,
    public authservice: AuthService,
    public storage: StorageService,
    public http: HttpClient,
    public iab: InAppBrowser,
    public alertController: AlertController,
    public toastController: ToastController
  ) {
    this.getStudentDetails = this.storage.getjson('studentDetail')[0];
    this.selected(this.getStudentDetails);
    this.platform.backButton.subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.translate.set();
  }

  ionViewWillEnter() {
    this.amount = '';
    this.sessionExpire = 0;
    this.tk_type = '';
    this.accessTk = '';
    this.merId = '';
    this.paydatas = [];
    if (this.paymentlist.length > 0) {
      for (let i = 0; i < this.paymentlist.length; i++) {
        this.paymentlist[i].isItemChecked = false;
        this.selectinterval.splice(i + 1, 1);
      }
    }
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'middle',
      cssClass: 'custom-toast',
    });
    toast.present();
  }

  onchangeevent($event: any, index: number) {
    this.paydatas = [];
    this.totalfee = 0;
    this.totalpaid = 0;
    this.asofbal = 0;
    if ($event.target.checked) {
      this.selectinterval = [];
      for (let i = 0; i < index + 1; i++) {
        if (
          this.paymentlist[i].hidden != undefined &&
          !this.paymentlist[i].hidden
        ) {
          this.paymentlist[i].isItemChecked = true;
          this.selectinterval.push(this.paymentlist[i].interval);
        }
      }
    } else {
      this.selectinterval = [];
      for (let i = index; i < this.paymentlist.length; i++) {
        this.paymentlist[i].isItemChecked = false;
      }
      for (let i = 0; i < this.paymentlist.length; i++) {
        if (this.paymentlist[i].isItemChecked) {
          this.selectinterval.push(this.paymentlist[i].interval);
        }
      }
    }
  }

  getSelected_val() {
    this.loading.present();
    var interival_id: number[] = [];
    this.authservice
      .post('getstudentpaydetails', {
        adno: this.ADNO,
        interval: interival_id.join(','),
      })
      .subscribe(
        (result) => {
          this.loading.dismissAll();
        },
        (err) => {
          this.loading.dismissAll();
        }
      );
  }

  selected(event: any) {
    this.cls = event.CLASSSEC;
    this.classID = event.CLASS_ID;
    this.name = event.NAME;
    this.ADNO = event.ADNO;
    this.contactNo = event.contact;
    this.admissionID = event.ADMISSION_ID;
    this.paymentlist = [];
    this.selectinterval = [];
    this.checkvalue = [];
    this.paydatas = [];
    this.totalfee = 0;
    this.totalpaid = 0;
    this.asofbal = 0;
    this.paymentHistoryArray = [];
    this.recIDArray = [];
    this.getpayenable();
    this.get();
    // this.getPaymentHistory();
  }

  selectineter(d: any) {
    this.paydatas = [];
    this.totalfee = 0;
    this.totalpaid = 0;
    this.asofbal = 0;
    if (this.selectinterval.indexOf(d) != -1) {
      let l = [];
      for (let i = 0; i < this.selectinterval.length; i++) {
        if (Number(d) <= Number(this.selectinterval[i])) {
          l.push(this.selectinterval[i]);
        }
      }
      for (let i = 0; i < l.length; i++) {
        this.selectinterval.splice(this.selectinterval.indexOf(l[i]), 1);
        this.checkvalue.splice(this.checkvalue.indexOf(Number(l[i])), 1);
      }
      for (let i = 0; i < this.checkvalue.length; i++) {
        if (Number(d) < this.checkvalue[i]) {
          this.selectinterval.splice(
            this.selectinterval.indexOf(this.checkvalue[i].toString()),
            1
          );
          this.checkvalue.splice(
            this.checkvalue.indexOf(this.checkvalue[i]),
            1
          );
        }
      }
    } else {
      if (d == '0') {
        this.selectinterval = [];
        this.selectinterval.push(d);
      } else {
        if (this.selectinterval.indexOf(d) == -1) {
          this.selectinterval.push(d);
        }
      }
    }
  }
  //////////////////////////////////////////////////////////////////////////////////
  checkdisable(d: any) {
    if (this.checkvalue.length > 0) {
      if (
        this.checkvalue[0] ==
        Number(this.paymentlist[this.paymentlist.length - 1].interval)
      ) {
        return false;
      }
    }

    d = Number(d);
    if (d > 0) {
      let l = true;
      for (let i = 0; i < this.selectinterval.length; i++) {
        let z = Number(this.selectinterval[i]);
        if (this.checkvalue.indexOf(z) != -1) {
          this.checkvalue.splice(this.checkvalue.indexOf(z), 1);
        }
        if (this.checkvalue.length == 0) {
          if (z <= d && this.checkvalue.indexOf(d) == -1) {
            this.checkvalue.push(d);
            l = false;
            i = this.selectinterval.length + 1;
          } else {
            l = true;
          }
        }
      }
      return l;
    } else {
      return false;
    }
  }

  getpayenable() {
    this.loading.present();
    this.authservice.post('getpayenable', { adno: this.ADNO }).subscribe(
      (result: any) => {
        if (result['status']) {
          this.paybutton = false;
        }
        this.loading.dismissAll();
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  paydetails() {
    this.loading.present();
    this.authservice
      .post('getstudentpaydetails', {
        adno: this.ADNO,
        interval: this.selectinterval.join(','),
      })
      .subscribe(
        (result: any) => {
          if (result['status']) {
            this.paydatas = result['Student_details']['FEE_DETAILS'];
            this.totalfee = 0;
            this.totalpaid = 0;
            this.asofbal = 0;
            for (let i = 0; i < this.paydatas.length; i++) {
              const e = this.paydatas[i];
              this.totalfee = this.totalfee + Number(e.Total_Amount);
              this.totalpaid = this.totalpaid + Number(e.PaidAmount);
              this.asofbal = this.asofbal + Number(e.Balance_Amount);
            }
          }
          this.loading.dismissAll();
        },
        (err) => {
          this.loading.dismissAll();
        }
      );
  }

  get() {
    this.loading.present();
    let data = {
      adno: this.ADNO,
    };
    this.authservice.post('getFeeInstallment', data).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          this.selectinterval = [];
          this.paymentlist = result['data'];
          // this.paymentlist = this.paymentlist.splice(1);
          let paymentAmt = result['data1'];
          let totalFeesAmount = 0;
          this.paymentlist.map((x: any) => {
            var result = paymentAmt.filter(
              (a1: any) => a1.interval == x.interval
            );
            if (result.length > 0) {
              x['amount'] = parseInt(result[0].amt);
              totalFeesAmount += parseInt(result[0].amt);
            }
          });
          // this.paymentlist[0].amount = totalFeesAmount;
          for (let i = 0; i < paymentAmt.length; i++) {
            if (paymentAmt[i].amt == 0) {
              this.paymentlist[i]['hidden'] = true;
            } else {
              this.paymentlist[i]['hidden'] = false;
            }
          }
        }
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  pay() {
    this.initiatePayment();
    // this.loading.present();
    // let data = {
    //   FEE_DETAILS: this.paydatas,
    //   TOT_AMOUNT: this.totalfee,
    //   contact: this.contactNo,
    //   ADMISSION_ID: this.admissionID,
    // };
    // this.authservice.post('getOrderID', data).subscribe(
    //   (result: any) => {
    //     this.loading.dismissAll();
    //     if (result['status']) {
    //       this.data = result['data'];
    //       var options = {
    //         description: 'Payment',
    //         image: 'https://i.imgur.com/3g7nmJC.jpg',
    //         order_id: this.data.order_id,
    //         currency: 'INR',
    //         key: this.data.key,
    //         amount: this.totalfee * 100,
    //         name: 'School Tree',
    //         theme: {
    //           color: '#3399cc',
    //         },
    //       };
    //       var successCallback = (success: any) => {
    //         this.loading.dismissAll();
    //         let data = {
    //           razorpay_order_id: success.razorpay_order_id,
    //           razorpay_payment_id: success.razorpay_payment_id,
    //           razorpay_signature: success.razorpay_signature,
    //         };
    //         this.authservice.post('insertPayments', data).subscribe(
    //           (result: any) => {
    //             this.loading.dismissAll();
    //             if (result['status']) {
    //               this.data = result['data'];
    //               this.router.navigate(['/payment']);
    //             }
    //           },
    //           (err) => {
    //             this.loading.dismissAll();
    //             //Connection failed message
    //           }
    //         );
    //       };

    //       var cancelCallback = (error: any) => {
    //         alert(error.description + ' (Error ' + error.code + ')');
    //         alert(error.source);
    //         alert(error.step);
    //         alert(error.reason);
    //         alert(error.metadata.order_id);
    //         alert(error.metadata.payment_id);
    //         this.loading.dismissAll();
    //       };

    //       // RazorpayCheckout.on("payment.success", successCallback);
    //       //  RazorpayCheckout.on("payment.cancel", cancelCallback);
    //       // RazorpayCheckout.open(options);
    //     }
    //   },
    //   (err) => {
    //     this.loading.dismissAll();
    //     //Connection failed message
    //   }
    // );
  }

  initiatePayment() {
    if (this.asofbal > 0) {
      const url =
        'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      const body = new URLSearchParams();
      body.set('client_id', 'SU2410211613209956253217');
      body.set('client_version', '1');
      body.set('client_secret', '6324a041-3ce0-45d9-a0bb-8ac4a52a4cfb');
      body.set('grant_type', 'client_credentials');

      this.http.post(url, body.toString(), { headers }).subscribe(
        (response: any) => {
          console.log('POST token successful:', response);
          if (
            response.access_token != undefined &&
            response.access_token != null &&
            response.access_token != ''
          ) {
            this.accessTk = response.access_token;
            this.sessionExpire = response.session_expires_at;
            this.tk_type = response.token_type;
            this.amount = this.asofbal;
            let mobNo = this.storage.getjson('studentDetail');
            let data = {
              payment_amount: this.amount,
              admission_id: this.admissionID,
              mobile_no: mobNo[0].contact,
              token: this.accessTk,
            };
            this.authservice.post('Payonline', data).subscribe(
              (result: any) => {
                if (result['status'] || result['STATUS']) {
                  this.merId = result.data;
                  this.startTransaction();
                }
              },
              (err) => {
                console.error('Error during insert:', err);
              }
            );
          }
        },
        (error) => {
          console.error('Error during POST tocken:', error);
        }
      );
    } else {
      this.showToast('Pending Rs. 0.', 'success');
    }
  }

  async startTransaction() {
    let feeData = [];
    for (let i = 0; i < this.paydatas.length; i++) {
      if (parseInt(this.paydatas[i].Balance_Amount) > 0) {
        feeData.push({
          FSID: this.paydatas[i].FSID,
          FHeadID: this.paydatas[i].feeheadId,
          FEE_HEAD: this.paydatas[i].Amt,
          FAsofBalance: this.paydatas[i].Balance_Amount,
        });
      }
    }
    let contact = this.getStudentDetails.contact;
    let datas = {
      stuFeeDetails: feeData,
      stuFeeDetails1: [
        {
          ADNO: this.paydatas[0].ADMISSION_ID,
          CLASS_ID: this.paydatas[0].CLASS_ID,
          contact: contact,
          name: this.paydatas[0].NAME,
          classsec: this.paydatas[0].CLASSSEC,
          TotAmt: this.amount,
          instal: 'Term',
          Year_Id: this.paydatas[0].Year_Id,
        },
      ],
      billbookid: this.paydatas[0].bills,
    };
    let payDetail = {
      token: this.accessTk,
      id: this.merId.toString(),
      amount: this.amount,
      FEE_DETAILS: datas,
    };
    this.authservice.post('updateOrderId', payDetail).subscribe(
      (result: any) => {
        if (result['status'] || result['STATUS']) {
          const browser = this.iab.create(result.data.redirectUrl, '_blank', {
            location: 'yes',
            hidden: 'no',
            toolbar: 'yes',
            zoom: 'no',
            useWideViewPort: 'yes',
          });

          browser.show();

          browser.on('exit').subscribe(() => {
            window.location.reload();
          });
        }
      },
      (err) => {
        console.error('Error during insert:', err);
      }
    );

    // const url = 'https://api.phonepe.com/apis/pg/checkout/v2/pay';

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': this.tk_type + " " + this.accessTk,
    //   'X-MERCHANT-ID': 'RAILWAYBALONLINE',
    //   'X-SOURCE': 'API',
    //   'X-SOURCE-PLATFORM':	'RAILWAYBALONLINE',
    //   'X-SOURCE-CHANNEL':	'android',
    //   'X-SOURCE-CHANNEL-VERSION':	11,
    //   'X-MERCHANT-APP-ID': 'com.schooltree.balabhavan',
    //   // 'X-MERCHANT-IP':	'120.138.9.248',
    //   'X-SOURCE-REDIRECTION-TYPE':	'MERCHANT_REDIRECTION'
    //     });

    // let base = this.apiBaseUrl.split(".php")[0]?.split("/");
    // base = base[base.length - 1];

    // const body = {
    //   "merchantOrderId": this.merId.toString(),
    //   "amount": this.amount * 100,
    //   "paymentFlow": {
    //     "type": "PG_CHECKOUT",
    //     "message": "Admission ID is " + this.admissionID + ", Transaction Amount is " + this.amount,
    //     "merchantUrls": {
    //       "redirectUrl": "https://parentalert.in/online/verify.php?mid=" + this.merId.toString(),
    //     }
    //   }
    // };

    // this.http.post(url, body, { headers })
    //   .subscribe(
    //     (response: any) => {
    //       let data = response;
    //       data["id"] = this.merId;
    //       let contact = this.getStudentDetails.contact;

    //       let feeData = [];
    //       for (let i = 0; i< this.paydatas.length; i++) {
    //         if (parseInt(this.paydatas[i].Balance_Amount) > 0) {
    //           feeData.push({"FSID":this.paydatas[i].FSID,"FHeadID":this.paydatas[i].feeheadId,"FEE_HEAD":this.paydatas[i].Amt,"FAsofBalance":this.paydatas[i].Balance_Amount});
    //         }
    //       }

    //       let datas = {
    //         "stuFeeDetails": feeData,
    //         "stuFeeDetails1":[{"ADNO": this.paydatas[0].ADMISSION_ID,"CLASS_ID":this.paydatas[0].CLASS_ID,"contact":contact,"name":this.paydatas[0].NAME,"classsec":this.paydatas[0].CLASSSEC,"TotAmt":this.amount,"instal":"Term","Year_Id":this.paydatas[0].Year_Id}],
    //         "billbookid":this.paydatas[0].bills};
    //       data["FEE_DETAILS"] = datas;
    //       this.authservice.post('updateOrderId', data).subscribe(
    //         (result: any) => {
    //           if (result['status'] || result['STATUS']) {
    //             const browser = this.iab.create(response.redirectUrl, '_blank', {
    //               location: 'yes',
    //               hidden: 'no',
    //               toolbar: 'yes',
    //               zoom: 'no',
    //               useWideViewPort: 'yes'
    //             });

    //             browser.show();

    //             browser.on('exit').subscribe(() => {
    //               window.location.reload();
    //             });
    //           }
    //         },
    //         (err) => {
    //           console.error('Error during insert:', err);
    //         }
    //       );
    //     },
    //     (error) => {
    //       console.error('Error during POST transaction:', error);
    //     }
    //   );
  }

  getPaymentHistory() {
    this.loading.present();
    let data = {
      adno: this.ADNO,
      CLASS_ID: this.classID,
    };
    this.authservice.post('getstudentpayHistory', data).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          this.paymentHistoryArray = result['Student_History']['FEE_HISTORY'];
          this.recIDArray = Object.keys(this.paymentHistoryArray);
        }
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  downloadPDF(item: any) {
    this.loading.present();
    let url = environment.apiBaseUrl.split('.php')[0].split('/');
    let data = {
      rid: item.RECPID,
      adno: this.ADNO,
      name: this.name,
      class: this.cls,
      YEAR_ID: item.YEAR_ID,
      dbname: url[url.length - 1],
    };
    this.authservice.post('getprintbill', data).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          const viewerUrl =
            'https://docs.google.com/viewer?url=' +
            encodeURIComponent(result['data']);
          const browser = this.iab.create(viewerUrl, '_blank', {
            location: 'yes',
            hidden: 'no',
            toolbar: 'yes',
            zoom: 'no',
            useWideViewPort: 'yes',
          });

          browser.show();
        }
      },
      (err) => {
        this.loading.dismissAll();
      }
    );

    // let url;
    // if (item.PAY_ID == "") {
    //   url = "https://parentalert.in/online/bills/pdf1.php?r=" + item.RECPID + "&adno=" + this.ADNO + "&name=" + this.name +  "&CLASSSEC=" + this.cls + "&yearid=" + item.YEAR_ID;
    // } else {
    //   url = "https://parentalert.in/online/bills/pdf.php?r=" + item.PAY_ID + "&adno=" + this.ADNO + "&name=" + this.name +  "&CLASSSEC=" + this.cls + "&yearid=" + item.YEAR_ID;
    // }

    // const viewerUrl = "https://docs.google.com/viewer?url=" + encodeURIComponent(url);
    // const browser = this.iab.create(viewerUrl, '_blank', {
    //   location: 'yes',
    //   hidden: 'no',
    //   toolbar: 'yes',
    //   zoom: 'no',
    //   useWideViewPort: 'yes'
    // });

    // browser.show();
  }
}
