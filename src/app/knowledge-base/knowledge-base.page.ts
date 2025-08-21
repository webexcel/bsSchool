import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.page.html',
  styleUrls: ['./knowledge-base.page.scss'],
})
export class KnowledgeBasePage implements OnInit {
  studentList: any[] = []; presentView: any; optionList: any[] = []; currentStudent: any; allKBRecords: any[] = [];
  currentSize: any; totalSize: any; initialIndex: any; finalIndex: any; incrementSize: any; type: any; subjectList: any[] = [];
  topicOptionList: any[] = []; currentSubject: any; currentTopic: any;

  constructor(public authservice: AuthService, private loading: LoadingService, public storage: StorageService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.presentView = "main";
    this.studentList = this.storage.getjson('studentDetail');
    this.currentSize = 0;
    this.totalSize = 0;
    this.incrementSize = 10;
  }

  getKBDataDatewise() {
    this.loading.present();
    this.authservice.post('getKBDataDatewise', {startIndex: this.initialIndex, endIndex: this.finalIndex, 
      class_id: this.currentStudent.CLASS_ID, type: this.type}).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result["status"]) {
          for (let i = 0; i < result["data"].length; i++) {
            this.allKBRecords.push(result["data"][i]);
          }
          this.totalSize = result["totalCount"];
          this.currentSize = this.allKBRecords.length;
        }
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  doInfinite(event: any) {
    this.initialIndex = this.finalIndex + 1;
    this.finalIndex = this.finalIndex + this.incrementSize;
    this.getKBDataDatewise();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  formatDate(date: Date = new Date()) {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    let mm = `${today.getMonth() + 1}`;
    let dd = `${today.getDate()}`;

    if (+dd < 10) {
      dd = '0' + dd;
    }
    if (+mm < 10) {
      mm = '0' + mm;
    }

    return dd + '/' + mm + '/' + yyyy;
  }

  checkimage(f: any) {
    if (f) {
      f = f.split('.');
      f = f[f.length - 1].toLowerCase();
      if (f != 'pdf' && f != 'mp3' && f != 'xls' && f != 'xlsx' && f != 'mp4') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
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
      if (f == 'doc' || f == 'docx') {
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
      let data = f.filePath != undefined ? f.filePath.split('.') : '';
      data =
        data != '' && data != undefined
          ? data[data.length - 1].toLowerCase()
          : '';
      if (data == 'mp4') {
        const urlParts = f['filePath'].split('/');
        const videoFilename = urlParts.pop();
        urlParts.push('thumb');
        const thumbnailFilename = videoFilename?.replace('.mp4', '.jpeg');
        urlParts.push(thumbnailFilename);
        f['thumbnail'] = urlParts.join('/');
        if (f['videoClicked'] == undefined) {
          f['thumbnailBase64Image'] = true;
          f['videoClicked'] = false;
        }
        return true;
      } else {
        return false;
      }
    } else {
      f['thumbnail'] = '';
      if (f['videoClicked'] == undefined) {
        f['thumbnailBase64Image'] = true;
        f['videoClicked'] = false;
      }
      return true;
    }
  }

  loadVideo(data: any) {
    data.thumbnailBase64Image = false;
    data.videoClicked = true;
  }

  getfilename(f: any) {
    f = f.split('/');
    f = f[f.length - 1];
    return f;
  }

  getStudentClassDetails(data: any) {
    this.presentView = 'data';
    this.allKBRecords = [];
    this.initialIndex = 0;
    this.finalIndex = this.initialIndex + this.incrementSize - 1;
    this.currentStudent = data;
    this.getKBDataDatewise();
  }

  closeView(evt: any) {
    if (evt == "data") {
      this.presentView = "main";
    }
  }
}
