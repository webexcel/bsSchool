import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CalendarComponent, CalendarMode } from 'ionic7-calendar';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';

@Component({
  selector: 'app-calender-mod',
  templateUrl: './calender-mod.page.html',
  styleUrls: ['./calender-mod.page.scss'],
})
export class CalenderModPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  eventSource: any[] = []; viewTitle: string; isModalOpen = false; selectedEvent: any;
  calendar: any = {
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
  };

  constructor(
    private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string,
    public loading: LoadingService, public authservice: AuthService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.get();
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

    this.isModalOpen = true;
  }

  get() {
    this.loading.present();
    this.authservice.post('getCalendar', {}).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          let d = result['data'];
          for (let i = 0; i < d.length; i++) {
            d[i]['startTime'] = new Date(d[i]['startDate']);
            d[i]['endTime'] = new Date(d[i]['endDate']);
          }
          this.eventSource = d;
          console.log(d);
        }
      },
      (err: any) => {
        this.loading.dismissAll();
      }
    );
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEvent = null;
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
    return dd + '-' + mm + '-' + yyyy;
  }

}