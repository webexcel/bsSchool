import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, IonModal, Platform } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthService } from '../service/auth.service';
import { FilesService } from '../service/files.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  ios: any = false;
  select_datas: any = {};
  select_datas1: any;
  @ViewChild('modal') modal!: IonModal;
  @ViewChild('modal1') modal1!: IonModal;
  isPickerOpen: boolean;
  showDatePicker: boolean;
  showDatePicker1: boolean;

  getStudentDetails: any;
  CLASS_ID: any;
  ADNO: any;

  selectedSessions: string[] = ['Full'];
  select_sessions = ['Full', 'Session 1', 'Session 2'];

  draftLeaveRequest: any = [];

  constructor(
    private serfile: FilesService,
    private sanitizer: DomSanitizer,
    public alertCtrl: AlertController,
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public authservice: AuthService,
    public storage: StorageService,
    public loading: LoadingService
  ) {}

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.getStudentDetails = this.storage.getjson('studentDetail');
    this.CLASS_ID = this.getStudentDetails[0].CLASS_ID;
    this.ADNO = this.getStudentDetails[0].ADNO;
    this.select_datas.s_date = new Date().toISOString();
    this.select_datas.e_date = new Date().toISOString();

    this.reset();

    this.getLeaveStatus();
  }
  reset() {
    this.select_datas.s_date = new Date().toISOString();
    this.select_datas.e_date = new Date().toISOString();
    this.select_datas.select_sessions = '';
    this.select_datas.message = '';
  }

  onSubmit(form: NgForm) {
    const selectedIndex = this.select_sessions.indexOf(
      this.select_datas.selectedSessions
    );

    this.select_datas.selectedSession = selectedIndex.toString(); // Convert to string
    this.select_datas.CLASS_ID = this.getStudentDetails[0].CLASS_ID;
    this.select_datas.ADNO = this.getStudentDetails[0].ADNO;

    this.loading.present();
    this.authservice.post('InsertLeaveRequest', this.select_datas).subscribe(
      (res: any) => {
        this.loading.dismissAll();
        if (res['status']) {
          form.resetForm();
          this.reset();
        }
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
    this.getLeaveStatusAndUpdate();
  }

  getLeaveStatus() {
    this.loading.present();
    this.authservice
      .post('getLeaveRequest', {
        ADNO: this.getStudentDetails[0].ADNO,
      })
      .subscribe(
        (res: any) => {
          this.loading.dismissAll();
          if (res['status']) {
            this.draftLeaveRequest = res['data'];
          } else {
            this.draftLeaveRequest = [];
          }
        },
        (err) => {
          this.loading.dismissAll();
          console.error('Error:', err);
        }
      );
  }

  getLeaveStatusAndUpdate() {
    this.getLeaveStatus(); // Fetch the latest leave requests
  }

  classids() {
    let c = this.storage.getjson('classlist');
    let l = [];
    for (let i = 0; i < c.length; i++) {
      l.push(c[i]['id']);
    }

    return l.join(',');
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

  cancel_date() {
    this.modal.dismiss(null, 'confirm');
  }

  confirm_date() {
    this.modal.dismiss(null, 'confirm');
  }

  confirm_date1() {
    this.modal1.dismiss(null, 'confirm');
  }

  toggleDateSelection() {
    this.isPickerOpen = !this.isPickerOpen;
  }

  showHideDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  showHideDatePicker1() {
    this.showDatePicker1 = !this.showDatePicker1;
  }

  onWillDismiss(event: Event, type: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'cancel') {
      if (type == 'first') {
        this.select_datas.s_date = null;
      } else {
        this.select_datas1.s_date = null;
      }
    }
  }

  onWillDismiss1(event: Event, type: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'cancel') {
      if (type == 'first') {
        this.select_datas.e_date = null;
      } else {
        this.select_datas.e_date = null;
      }
    }
  }
}
