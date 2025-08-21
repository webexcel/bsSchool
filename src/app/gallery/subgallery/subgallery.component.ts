import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Swiper } from 'swiper';
import { AuthService } from '../../service/auth.service';
import { FilesService } from '../../service/files.service';
import { LoadingService } from '../../service/loading.service';
import { StorageService } from '../../service/storage.service';

@Component({
  selector: 'app-subgallery',
  templateUrl: './subgallery.component.html',
  styleUrls: ['./subgallery.component.scss'],
})
export class SubgalleryComponent implements OnInit {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;
  responseData: any;
  subgalleryImgView: any = [];
  imageurl: any = '';
  ing: any = 0;
  show: any = false;
  screenHeight = this.platform.height();
  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
    private location: Location,
    public loading: LoadingService,
    public authservice: AuthService,
    public storage: StorageService,
    private serfile: FilesService
  ) {
    this.serfile.checkdir();
    this.platform.backButton.subscribe(() => {
      this.location.back();
    });
  }

  ngOnInit() {
    this.subGalleryImageDisplay(this.route.snapshot.paramMap.get('id'));
  }

  subGalleryImageDisplay(catid: any) {
    this.loading.present();
    var catID = { GalCatID: catid };
    this.authservice.post('getCategoryAll', catID).subscribe(
      (result) => {
        this.responseData = result;
        if (this.responseData.status) {
          this.subgalleryImgView = this.responseData.data;
          this.imageurl = this.responseData.url;
        } else {
          // ss  alert(this.responseData.message)
        }
        this.getbase64();
        this.loading.dismissAll();
      },
      (err) => {
        this.loading.dismissAll();
        //Connection failed message
      }
    );
  }

  close() {
    this.location.back();
  }

  getbase64() {
    try {
      if (this.ing < this.subgalleryImgView.length) {
        this.subgalleryImgView[this.ing].filename = '';
        let url =
          this.imageurl +
          '/' +
          this.subgalleryImgView[this.ing].CatID +
          '/' +
          this.subgalleryImgView[this.ing].GalPath;
        let l = url.split('/');
        let filename = l[l.length - 1];
        this.subgalleryImgView[this.ing].filename = filename;
        this.subgalleryImgView[this.ing].base64 = '';
        let f = this.serfile.checkfile(filename);
        if (f) {
          f.then(
            (res) => {
              this.serfile.read(filename).then(
                (res) => {
                  if (res.split('base64,')[1].length != 0) {
                    this.subgalleryImgView[this.ing].base64 = res;
                  } else {
                    this.serfile.removefile(filename);
                    this.subgalleryImgView[this.ing].base64 = '';
                  }
                  this.ing = this.ing + 1;
                  this.getbase64();
                },
                (err) => {}
              );
            },
            (err) => {
              this.authservice
                .post('getbase64', { url: url.replace(/ /g, '%20') })
                .subscribe(
                  (res: any) => {
                    if (res) {
                      this.subgalleryImgView[this.ing].base64 = res['data'];
                      let k = this.serfile.download(filename, res['data']);
                      if (k) {
                        this.subgalleryImgView[this.ing].base64 = '';
                        this.ing = this.ing + 1;
                        this.getbase64();
                      } else {
                        this.subgalleryImgView[this.ing].base64 = '';
                        this.ing = this.ing + 1;
                        this.getbase64();
                      }
                    }
                  },
                  (err) => {
                    this.subgalleryImgView[this.ing].base64 = '';
                    this.ing = this.ing + 1;
                    this.getbase64();
                  }
                );
            }
          );
        } else {
          this.subgalleryImgView[this.ing].base64 = '';
          this.ing = this.ing + 1;
          this.getbase64();
        }
      } else {
        this.show = true;
      }
    } catch (error) {
      this.subgalleryImgView[this.ing].base64 = '';
      this.ing = this.ing + 1;
      this.getbase64();
    }
  }
}
