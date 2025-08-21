import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, Platform } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { FilesService } from '../service/files.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';
@Component({
  selector: 'app-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss'],
})
export class HomeworkComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  isModalOpen = false;
  modalImage: any;
  setOpen(isOpen: boolean, image: any) {
    this.modalImage = image;
    this.isModalOpen = isOpen;
  }
  ios: any = false;
  resposeData: any;
  homeworkdata: any = {};
  homeworkdates: any = [];

  sname: any = '';
  ing: any = 0;
  hdind: any = 0;
  show: any = false;
  getStudentDetails: any = [];
  segment: any;
  pageSize: any = 10;
  currentSize: any = 0;

  scroll: any;

  constructor(
    private storage: StorageService,
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public loading: LoadingService,
    public authservice: AuthService,
    private serfile: FilesService
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

  selected(event: any) {
    this.sname = '';
    this.gethomework(event.CLASS_ID, event.NAME);
  }

  gethomework(classid: any, name: any) {
    this.homeworkdata = {};
    this.homeworkdates = [];

    var storeData = {
      classid: classid,
      page_size: this.pageSize,
      current_size: this.currentSize,
      //  adno: this.getStudentDetails.data[i]['ADNO'],
    };

    this.loading.present();

    this.authservice.post('getSaveHomeworkbyclass', storeData).subscribe(
      (result) => {
        this.loading.dismissAll();

        this.resposeData = result;

        if (this.resposeData.status) {
          this.homeworkdates = [];
          for (let i = 0; i < this.resposeData.data.length; i++) {
            let d = this.resposeData.data[i]['MSG_DATE'];

            if (this.homeworkdates.indexOf(d) == -1) {
              this.homeworkdates.push(d);

              this.homeworkdata[d] = [];
            }
            this.homeworkdata[d].push(this.resposeData.data[i]);
            this.currentSize += 1;
          }

          if (Object.keys(this.homeworkdata).length === 0) {
            this.homeworkdata = this.resposeData.data.reduce(
              (acc: any, obj: any) => {
                const date = obj['MSG_DATE'];
                acc[date] = [obj];
                return acc;
              },
              {}
            );
          }

          if (this.resposeData.total_size == this.currentSize) {
            this.scroll = false;
          } else {
            this.scroll = true;
          }
        }

        this.sname = name;
        this.ing = 0;
        this.hdind = 0;
        this.getbase64();
      },
      (err) => {
        this.loading.dismissAll();
        //Connection failed message
      }
    );
  }

  checkimage(f: any) {
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
        f != 'doc' &&
        f != 'docx'
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

  checkmp3(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'mp3' || f == 'wav') {
        1;
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

  checkdoc(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f == 'docx') {
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
      if (f == 'doc') {
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

  getfilename(f: any) {
    f = f.split('/');
    f = f[f.length - 1];
    return f;
  }

  getbase64() {
    try {
      if (this.hdind < this.homeworkdates.length) {
        let hdind = this.homeworkdates[this.hdind];
        if (this.ing < this.homeworkdata[hdind].length) {
          this.homeworkdata[hdind][this.ing].filename = '';
          let url = this.homeworkdata[hdind][this.ing].event_image;
          if (url && url.length > 0) {
            let l = url.split('/');
            let filename = l[l.length - 1];
            this.homeworkdata[hdind][this.ing].filename = filename;
            this.homeworkdata[hdind][this.ing].base64 = '';
            let f = this.serfile.checkfile(filename);
            if (f) {
              f.then(
                (res) => {
                  this.serfile.read(filename).then(
                    (res) => {
                      if (res.split('base64,')[1].length != 0) {
                        this.homeworkdata[hdind][this.ing].base64 = res;
                      } else {
                        this.serfile.removefile(filename);
                        this.homeworkdata[hdind][this.ing].base64 = '';
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
                          this.homeworkdata[hdind][this.ing].base64 =
                            res['data'];
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
                        this.homeworkdata[hdind][this.ing].base64 = '';
                        this.ing = this.ing + 1;
                        this.getbase64();
                      }
                    );
                }
              );
            } else {
              this.homeworkdata[hdind][this.ing].base64 = '';
              this.ing = this.ing + 1;
              this.getbase64();
            }
          } else {
            this.homeworkdata[hdind][this.ing].event_image = '';
            this.homeworkdata[hdind][this.ing].base64 = '';
            this.ing = this.ing + 1;
            this.getbase64();
          }
        } else {
          this.ing = 0;
          this.hdind = this.hdind + 1;
          this.getbase64();
        }
      } else {
        this.show = true;
      }
    } catch (error) {
      this.homeworkdata[this.hdind][this.ing].base64 = '';
      this.ing = this.ing + 1;
      this.getbase64();
    }
  }
}
