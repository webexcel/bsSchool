import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { FilesService } from '../service/files.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  ios: any = false;
  responseData: any;
  galleryImages: any;
  imageurl: any = '';
  getStudentDetails: any = [];
  value: any = [];
  ing: any = 0;
  show: any = false;
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
      let p = this.storage.get('page');
      if (p == 'gallery') {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.translate.set();
    this.galleryImageDisplay();
  }

  galleryImageDisplay() {
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
    this.authservice.post('getCategory', { CLASS_ID: value }).subscribe(
      (result) => {
        this.loading.dismissAll();
        this.responseData = result;
        if (this.responseData.status) {
          this.galleryImages = this.responseData.data;
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
      if (this.ing < this.galleryImages.length) {
        this.galleryImages[this.ing].filename = '';
        let url =
          this.imageurl +
          '/' +
          this.galleryImages[this.ing].CatID +
          '/' +
          this.galleryImages[this.ing].GalPath;
        let l = url.split('/');
        let filename = l[l.length - 1];
        this.galleryImages[this.ing].filename = filename;
        this.galleryImages[this.ing].base64 = '';
        let f = this.serfile.checkfile(filename);
        if (f) {
          f.then(
            (res) => {
              this.serfile.read(filename).then(
                (res) => {
                  if (res.split('base64,')[1].length != 0) {
                    this.galleryImages[this.ing].base64 = res;
                  } else {
                    this.serfile.removefile(filename);
                    this.galleryImages[this.ing].base64 = '';
                  }
                  this.ing = this.ing + 1;
                  this.getbase64();
                },
                (err) => {
                  this.galleryImages[this.ing].base64 = '';
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
                      this.galleryImages[this.ing].base64 = res['data'];
                      let k = this.serfile.download(filename, res['data']);
                      if (k) {
                        this.galleryImages[this.ing].base64 = '';
                        this.ing = this.ing + 1;
                        this.getbase64();
                      } else {
                        this.ing = this.ing + 1;
                        this.getbase64();
                      }
                    }
                  },
                  (err) => {
                    this.galleryImages[this.ing].base64 = '';
                    this.ing = this.ing + 1;
                    this.getbase64();
                  }
                );
            }
          );
        } else {
          this.galleryImages[this.ing].base64 = '';
          this.ing = this.ing + 1;
          this.getbase64();
        }
      } else {
        this.show = true;
      }
      console.log(this.galleryImages[this.ing].base64);
    } catch (error) {
      this.galleryImages[this.ing].base64 = '';
      this.ing = this.ing + 1;
      this.getbase64();
    }
  }
}
