import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { CalendarComponent, CalendarMode } from 'ionic7-calendar';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  ios: any = false;
  date: any;
  eventDay: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: any = [];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  data: any = { absent: [], detail: [] };
  absentCount: any;
  getStudentDetails: any;
  eventSource: any[] = []; viewTitle: string; selectedEvent: any;
  calendar: any = {
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
  };

  constructor(
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public loading: LoadingService,
    public authservice: AuthService,
    public storage: StorageService
  ) {
    this.date = new Date();
    this.monthNames = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];
    this.getStudentDetails = this.storage.getjson('studentDetail')[0];
    this.selected(this.getStudentDetails);

    this.platform.backButton.subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.translate.set();
    //this.getStudentDetails = this.storage.getjson('studentDetail');
  }

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
      this.eventDay = 26;
    } else {
      this.currentDate = 999;
    }

    let firstDayThisMonth = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      1
    ).getDay();
    let prevNumOfDays = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      0
    ).getDate();
    for (
      var i = prevNumOfDays - (firstDayThisMonth - 1);
      i <= prevNumOfDays;
      i++
    ) {
      this.daysInLastMonth.push(i);
    }

    let thisNumOfDays = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      let l: any = false;
      for (let j = 0; j < this.data.absent.length; j++) {
        if (
          new Date(this.data.absent[j]).toString() ==
          new Date(
            this.date.getFullYear(),
            this.date.getMonth(),
            i + 1
          ).toString()
        ) {
          l = true;
          j = this.data.absent.length + 1;
        } else {
          l = false;
        }
      }
      if (l == true) {
        this.daysInThisMonth.push({ num: i + 1, aub: true });
      } else {
        this.daysInThisMonth.push({ num: i + 1, aub: false });
      }
    }

    let lastDayThisMonth = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 1,
      0
    ).getDay();
    var nextNumOfDays = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + 2,
      0
    ).getDate();
    for (var i = 0; i < 6 - lastDayThisMonth; i++) {
      this.daysInNextMonth.push(i + 1);
    }
    let totalDays =
      this.daysInLastMonth.length +
      this.daysInThisMonth.length +
      this.daysInNextMonth.length;
    if (totalDays < 32) {
      for (var i = 7 - lastDayThisMonth; i < 7 - lastDayThisMonth + 7; i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }

  selected(event: any) {
    this.data.detail.length = 0;
    this.getattendance(event.ADNO);
  }

  getattendance(item: any) {
    this.loading.present();
    let data = { ADNO: item };
    this.data.absent = [];
    this.data.detail = [];
    this.authservice.post('getAttendance', data).subscribe(
      (result: any) => {
        if (result['status']) {
          for (let i = 0; i < result['data'].length; i++) {
            this.data.absent.push(result['data'][i]['absent']);
            this.data.detail.push(result['data'][i]);
          }
          this.eventSource = result['data'];
          for (let i = 0; i < result['data'].length; i++) {
            this.eventSource[i]['startTime'] = new Date(this.eventSource[i]['absent']);
            this.eventSource[i]['endTime'] = new Date(this.eventSource[i]['absent']);
          }
        }
        this.absentCount = this.data.detail.length;
        this.getDaysOfMonth();
        this.loading.dismissAll();
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  next() {
    this.myCal.slideNext();
  }
  
  back() {
    this.myCal.slidePrev();
  }

  onViewTitleChanged(title: any) {
    if (title == 'current') {
      this.myCal.currentDate = new Date();
    } else {
      this.viewTitle = title;
    }
  }

  async onEventSelected(event: any) {    
    this.selectedEvent = {
      ...event,
      startTime: formatDate(event.startTime, 'medium', 'en-US'),
      endTime: formatDate(event.endTime, 'medium', 'en-US'),
    };
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
    return dd + '-' + mm + '-' + yyyy;
  }
}
