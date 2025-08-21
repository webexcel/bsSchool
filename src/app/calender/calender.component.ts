import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { EventData } from 'src/projects/ngx-event-calendar/src/lib/interface/event-data';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { TranslateConfigService } from '../service/translate-config.service';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
})
export class CalenderComponent implements OnInit {
  ios: any = false;
  dataArray: EventData[] = [];
  events: any = [];



  constructor(
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public loading: LoadingService,
    public authservice: AuthService
  ) {
    this.platform.backButton.subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.translate.set();
    this.get();
  }

  get() {
    this.loading.present();
    this.authservice.post('getCalendar', {}).subscribe(
      (result: any) => {
        this.loading.dismissAll();
        if (result['status']) {
          let d = result['data'];
          for (let i = 0; i < d.length; i++) {
            d[i]['startDate'] = new Date(d[i]['startDate']);
            d[i]['endDate'] = new Date(d[i]['endDate']);
          }
          this.dataArray = d;
        }
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  selectDay(event: any) {
    this.events = event.events;
  }
}


