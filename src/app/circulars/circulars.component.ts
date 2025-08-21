import {
  Component,
  ElementRef,
  OnInit,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Swiper } from 'swiper';
import { AuthService } from '../service/auth.service';
import { FilesService } from '../service/files.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';

@Component({
  selector: 'app-circulars',
  templateUrl: './circulars.component.html',
  styleUrls: ['./circulars.component.scss'],
})
export class CircularsComponent implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  ios: any = false;
  resposeData: any;
  mobileIDdetail: any;
  getStudentDetail: any;
  SMS_resposeData: any;
  storeSMSDetails: any[] = [];
  ing: any = 0;
  show: any = false;
  Message: any;
  pageSize: any = 10;
  currentSize: any = 0;
  scroll: any;
  isModalOpen = false;
  modalImage: any;
  type: any;
  studentProfile: any;

  constructor(
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public authservice: AuthService,
    public storage: StorageService,
    public loading: LoadingService,
    private serfile: FilesService,
    public sanitizer: DomSanitizer
  ) {
    this.platform.backButton.subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.translate.set();
    this.mobileIDdetail = this.storage.get('mobileid');
    this.getStudentDetail = this.storage.getjson('studentDetail');
    this.getSMSLogDetails(this.getStudentDetail[0].contact);
  }

  ionViewWillEnter() {
    // this.currentSize = 0;
    this.studentProfile = this.storage.get('profilePic');
  }

  transform(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }

  setOpen(isOpen: boolean, image: any, type: any) {
    console.log(image);
    this.modalImage = image;
    this.isModalOpen = isOpen;
    this.type = type;
  }

  getSMSLogDetails(contact: any) {
    let detail = {
      mobile_number: contact,
      page_size: this.pageSize,
      current_size: this.currentSize,
    };
    this.loading.present();
    this.authservice.post('getAllMessageOnMobIntIdnew', detail).subscribe(
      (result) => {
        this.loading.dismissAll();

        this.SMS_resposeData = result;
        if (this.storeSMSDetails.length == 0) {
          this.storeSMSDetails =
            this.SMS_resposeData.data == '' ? [] : this.SMS_resposeData.data;
        } else {
          for (let i = 0; i < this.SMS_resposeData.data.length; i++) {
            this.storeSMSDetails.push(this.SMS_resposeData.data[i]);
          }
        }
        for (let i = 0; i < this.storeSMSDetails.length; i++) {
          if (this.storeSMSDetails[i].Message.includes('http')) {
            let data = this.storeSMSDetails[i].Message.split('http');
            this.storeSMSDetails[i].Message = data[0];
            this.storeSMSDetails[i]['link'] = 'http' + data[1];
          }
        }

        this.currentSize = this.storeSMSDetails.length;

        if (this.SMS_resposeData.total_size == this.currentSize) {
          this.scroll = false;
        } else {
          this.scroll = true;
        }

        this.getbase64();
        // this.checkForLinks();
      },
      (err) => {
        this.loading.dismissAll();
        //Connection failed message
      }
    );
  }

  doInfinite(evt: any) {
    this.getSMSLogDetails(this.getStudentDetail[0].contact);
    setTimeout(() => {
      evt.target.complete();
    }, 1000);
  }

  // to remove error : Error: unsafe value used in a resource URL context
  getSafeUrl(url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getbase64() {
    try {
      if (this.ing < this.storeSMSDetails.length) {
        this.storeSMSDetails[this.ing].filename = '';
        let url = this.storeSMSDetails[this.ing].event_image;
        if (url && url.length > 0) {
          let l = url.split('/');
          let filename = l[l.length - 1];
          this.storeSMSDetails[this.ing].filename = filename;
          this.storeSMSDetails[this.ing].base64 = '';
          let f = this.serfile.checkfile(filename);
          if (f) {
            f.then(
              (res) => {
                this.serfile.read(filename).then(
                  (res) => {
                    if (res.split('base64,')[1].length != 0) {
                      this.storeSMSDetails[this.ing].base64 = res;
                    } else {
                      this.serfile.removefile(filename);
                      this.storeSMSDetails[this.ing].base64 = '';
                    }
                    this.ing = this.ing + 1;
                    this.getbase64();
                  },
                  (err) => {
                    this.ing = this.ing + 1;
                    this.getbase64();
                  }
                );
              },
              (err) => {
                this.authservice
                  .post('getbase64', { url: encodeURI(url) })
                  .subscribe(
                    (res: any) => {
                      if (res) {
                        this.storeSMSDetails[this.ing].base64 = res['data'];
                        let k = this.serfile.download(filename, res['data']);
                        if (k) {
                          this.ing = this.ing + 1;
                          this.getbase64();
                        } else {
                          this.ing = this.ing + 1;
                          this.getbase64();
                        }
                      }
                    },
                    (err) => {
                      this.storeSMSDetails[this.ing].base64 = '';
                      this.ing = this.ing + 1;
                      this.getbase64();
                    }
                  );
              }
            );
          } else {
            this.storeSMSDetails[this.ing].base64 = '';
            this.ing = this.ing + 1;
            this.getbase64();
          }
        } else {
          this.storeSMSDetails[this.ing].event_image = '';
          this.storeSMSDetails[this.ing].base64 = '';
          this.ing = this.ing + 1;
          this.getbase64();
        }
      } else {
        this.show = true;
      }
    } catch (error) {
      this.storeSMSDetails[this.ing].base64 = '';
      this.ing = this.ing + 1;
      this.getbase64();
    }
  }

  checkimage(f: any) {
    //https://demo.schooltree.in/uploads/tms/images.png
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();

      if (
        f != 'pdf' &&
        f != 'mp3' &&
        f != 'mp4' &&
        f != 'xls' &&
        f != 'xlsx' &&
        f != 'wav' &&
        f != 'docx' &&
        f != 'doc'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    //image.event_image.split('.')[image.event_image.split('.').length-1]!='pdf'
  }

  checkmp3(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'mp3' || f == 'wav') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkmp4(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'mp4') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkxls(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'xls' || f == 'xlsx') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkpdf(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'pdf') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkdoc(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'doc') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkdocx(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'doc' || f == 'docx') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getfilename(f: any) {
    f = f.split('/');
    f = f[f.length - 1];
    return f;
  }
}
