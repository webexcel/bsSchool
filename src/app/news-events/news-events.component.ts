import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';
// import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { FilesService } from '../service/files.service';

@Component({
  selector: 'app-news-events',
  templateUrl: './news-events.component.html',
  styleUrls: ['./news-events.component.scss'],
})
export class NewsEventsComponent implements OnInit {
  ios: any = false;
  responseData: any;
  newsImages: any = [];
  imageurl: any = '';
  getStudentDetails: any = [];
  public base64: any;
  ing: any = 0;
  show: any = false;
  value: any = [];
  constructor(
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public loading: LoadingService,
    public authservice: AuthService,
    public storage: StorageService,
    private serfile: FilesService
  ) {
    this.serfile.checkdir();
    this.platform.backButton.subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.translate.set();
    this.newsImageDisplay();
  }

  newsImageDisplay() {
    this.value = [];
    this.value.push('0');
    this.getStudentDetails = this.storage.getjson('studentDetail');

    for (let i = 0; i < this.getStudentDetails.length; i++) {
      if (this.getStudentDetails[i]['CLASS_ID'] == null) {
        this.value.push('0');
      } else {
        this.value.push(this.getStudentDetails[i]['CLASS_ID'].toString());
      }
    }
    let value = this.value.join(',');
    this.loading.present();
    //let eventDetail ="show_flag";
    this.authservice.post('getMobileevents', { CLASS_ID: value }).subscribe(
      (result) => {
        this.loading.dismissAll();
        this.responseData = result;
        if (this.responseData.status) {
          this.newsImages = this.responseData.data;
          this.imageurl = this.responseData.url;
        }
        this.getbase64();
      },
      (err) => {
        this.loading.dismissAll();
        //Connection failed message
      }
    );
    //
  }

  getbase64() {
    try {
      if (this.ing < this.newsImages.length) {
        this.newsImages[this.ing].filename = '';
        let url = this.newsImages[this.ing].event_image;
        let l = url.split('/');
        let filename = l[l.length - 1];
        this.newsImages[this.ing].filename = filename;
        this.newsImages[this.ing].base64 = '';
        let f = this.serfile.checkfile(filename);
        if (f) {
          f.then(
            (res) => {
              this.serfile.read(filename).then(
                (res) => {
                  if (res.split('base64,')[1].length != 0) {
                    this.newsImages[this.ing].base64 = res;
                  } else {
                    this.serfile.removefile(filename);
                    this.newsImages[this.ing].base64 = '';
                  }
                  this.ing = this.ing + 1;
                  this.getbase64();
                },
                (err) => {
                  this.newsImages[this.ing].base64 = '';
                  this.ing = this.ing + 1;
                  this.getbase64();
                }
              );
            },
            (err) => {
              this.authservice
                .post('getbase64', { url: url.replace(/ /g, '%20') })
                .subscribe(
                  (res: any) => {
                    if (res) {
                      this.newsImages[this.ing].base64 = res['data'];
                      let k = this.serfile.download(filename, res['data']);
                      if (k) {
                        this.newsImages[this.ing].base64 = '';
                        this.ing = this.ing + 1;
                        this.getbase64();
                      } else {
                        this.newsImages[this.ing].base64 = '';
                        this.ing = this.ing + 1;
                        this.getbase64();
                      }
                    }
                  },
                  (err) => {
                    this.newsImages[this.ing].base64 = '';
                    this.ing = this.ing + 1;
                    this.getbase64();
                  }
                );
            }
          );
        } else {
          this.newsImages[this.ing].base64 = '';
          this.ing = this.ing + 1;
          this.getbase64();
        }
      } else {
        this.show = true;
      }
    } catch (error) {
      this.newsImages[this.ing].base64 = '';
      this.ing = this.ing + 1;
      this.getbase64();
    }
  }

  checkimage(f: any) {
    //image.event_image.split('.')[image.event_image.split('.').length-1]!='pdf'
    f = f.split('.');
    f = f[f.length - 1].toLowerCase();
    if (f != 'pdf') {
      return true;
    } else {
      return false;
    }
  }

  checkpdf(f: any) {
    f = f.split('.');
    f = f[f.length - 1].toLowerCase();
    if (f == 'pdf') {
      return true;
    } else {
      return false;
    }
  }

  getfilename(f: any) {
    f = f.split('/');
    f = f[f.length - 1];
    return f;
  }

  blobToBase64(blob: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        resolve(dataUrl);
      };
      reader.readAsDataURL(blob);
    });
  }
}
