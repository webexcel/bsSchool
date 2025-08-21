import { Component, OnInit } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { VideoProcessingService } from '../service/video-processing-service';

@Component({
  selector: 'app-leave-letter',
  templateUrl: './leave-letter.page.html',
  styleUrls: ['./leave-letter.page.scss'],
})
export class LeaveLetterPage implements OnInit {
  formData: any; s_date: any; e_date: any; isStartDateSelection: boolean = false; isEndDateSelection: boolean = false;
  leaveDetails: any[] = []; presentView: any; currentIndex: any; student: any[] = []; selectedStudent: any; currentStudent: any;
  select_sessions = [
    { id: '1', name: 'Full' },
    { id: '2', name: 'Morning' },
    { id: '3', name: 'Afternoon' },
  ];

  constructor(private toastController: ToastController, private videoService: VideoProcessingService,
    private file: File, private fileOpener: FileOpener, private storage: StorageService, private loading: LoadingService,
    private authservice: AuthService
  ) { }

  ngOnInit() {
    this.student = this.storage.getjson("studentDetail");
    this.selectedStudent = this.student[0].ADNO;
    this.currentStudent = this.student[0];
    this.presentView = "view";
    this.s_date = new Date().toISOString();
    this.e_date = new Date().toISOString();
    this.formData = {
      id: null,
      s_date: new Date().toISOString(),
      e_date: new Date().toISOString(),
      reason: "",
      status: "1",
      image: "",
      filename: "",
      type: "",
      selectedSession: ""
    }
    this.getLeaveReq();
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'middle'
    });
    toast.present();
  }

  resetForm() {
    this.presentView = "view";
    this.s_date = new Date().toISOString();
    this.e_date = new Date().toISOString();
    this.formData = {
      id: null,
      s_date: new Date().toISOString(),
      e_date: new Date().toISOString(),
      reason: "",
      status: "1",
      image: "",
      filename: "",
      type: "",
      selectedSession: ""
    };
  }

  getLeaveReq() {
    this.loading.present();
    this.authservice
      .post('getLeaveRequest', {"ADNO": "24"})
      .subscribe(
        (res: any) => {
          this.leaveDetails = res["data"];
          this.loading.dismissAll();
        },
        (err) => {
          this.loading.dismissAll();
        });
  }

  formatDate(date: Date = new Date()) {
    const today = new Date(date);
    const yyyy = today.getFullYear();
    let mm = `${today.getMonth() + 1}`; // Months start at 0!
    let dd = `${today.getDate()}`;

    if (+dd < 10) {
      dd = '0' + dd;
    }
    if (+mm < 10) {
      mm = '0' + mm;
    }

    return dd + '/' + mm + '/' + yyyy;
  }

  selected(evt: any) {
    this.currentStudent = evt;
  }

  toggleDateSelection(evt: any) {
    if (evt == "start") {
      this.isStartDateSelection = true;
    } else if (evt == "end") {
      this.isEndDateSelection = true;
    }
  }

  onWillDismiss(event: Event, type: any) {
    if (type == 'start') {
      this.s_date = this.formData.s_date;
      this.isStartDateSelection = false;      
    } else if (type == "end") {
      this.e_date = this.formData.e_date;
      this.isEndDateSelection = false;
    }
  }

  confirm_date(evt: any) {
    if (evt == "start") {
      if (new Date(this.s_date) <= new Date(this.formData.e_date)) {
        this.formData.s_date = this.s_date;
        this.isStartDateSelection = false;
      } else {
        this.showToast("Start Date should be lesser than or equal to End Date!", "danger");
      }
    } else if (evt == "end") {
      if (new Date(this.formData.s_date) <= new Date(this.e_date)) {
        this.formData.e_date = this.e_date;
        this.isEndDateSelection = false;
      } else {
        this.showToast("End Date should be greater than or equal to Start Date!", "danger");
      }
    }
  }

  cancel_date(evt: any) {
    if (evt == "start") {
      this.isStartDateSelection = false;
    } else if (evt == "end") {
      this.isEndDateSelection = false;
    }
  }

  toggleContent() {
    this.presentView = "add";
  }

  saveLeaveRequest() {
    if (this.presentView == "add") {
      let data = {
        "ADNO": this.currentStudent.ADNO,
        "CLASS_ID": this.currentStudent.CLASS_ID,
        "selectedSession": this.formData.selectedSession,
        "s_date": this.formData.s_date,
        "e_date": this.formData.e_date,
        "message": this.formData.reason,
      };
      this.loading.present();
      this.authservice.post('InsertLeaveRequest', data).subscribe(
        (res: any) => {
          this.loading.dismissAll();
          if (res['status']) {
            this.getLeaveReq();
            this.resetForm();
          }
        },
        (err) => {
          this.loading.dismissAll();
        }
      );
    } else if (this.presentView == "edit") {
      let data = {
        "id": this.formData.id,
        "selectedSession": this.formData.selectedSession,
        "s_date": this.formData.s_date,
        "e_date": this.formData.e_date,
        "message": this.formData.reason,
      };
      this.loading.present();
      this.authservice.post('getUpdateLeaveRequest', data).subscribe(
        (res: any) => {
          this.loading.dismissAll();
          if (res['status']) {
            this.getLeaveReq();
            this.resetForm();
          }
        },
        (err) => {
          this.loading.dismissAll();
        }
      );
    }
  }

  editLeaveRecord(index: any) {
    this.currentIndex = index;
    this.presentView = "edit";
    this.formData = { 
      id: this.leaveDetails[index].id,
      selectedSession: this.leaveDetails[index].abtype,
      s_date: this.leaveDetails[index].fdate,
      e_date: this.leaveDetails[index].tdate,
      reason: this.leaveDetails[index].reson
    };
  }

  deleteLeaveRecord(index: any) {
    this.loading.present();
      this.authservice.post('getDeleteLeaveRequest', {id: this.leaveDetails[index].id}).subscribe(
        (res: any) => {
          this.loading.dismissAll();
          if (res['status']) {
            this.getLeaveReq();
            this.resetForm();
          }
        },
        (err) => {
          this.loading.dismissAll();
        }
      );
  }

  open() {
    this.videoService
    .promptForVideo()
    .then((videoFile) => {
      if (!videoFile.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          this.formData.image = e.target.result;
          this.formData.filename = videoFile.name;
          this.formData.type = videoFile.name.split('.').pop();
          this.writeFile(
            e.target.result,
            videoFile.name,
            videoFile.type
          );
        };
        reader.readAsDataURL(videoFile);
      }
    })
    .catch((error) => {
      console.error('Error generating thumbnail:', error);
    });
  }

  writeFile(FileContents: any, FileName: any, FileType: any) {
    let blob = this.b64toBlob(FileContents, FileType);
    this.file
      .writeFile(this.file.dataDirectory, FileName, blob, { replace: true })
      .then((response) => {
        this.fileOpener.open(this.file.dataDirectory + FileName, FileType);
      })
      .catch((err: any) => {
        console.error('Error writing file:', err);
      });
  }

  b64toBlob(b64Data: any, contentType: any) {
    let index = String(b64Data).lastIndexOf(',');
    let data = String(b64Data).substring(index + 1);
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
