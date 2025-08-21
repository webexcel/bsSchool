import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';
@Component({
  selector: 'app-exam-schedule',
  templateUrl: './exam-schedule.component.html',
  styleUrls: ['./exam-schedule.component.scss'],
})
export class ExamScheduleComponent implements OnInit {
  ios: any = false;
  schedule: any = [];
  show: any = false;
  getStudentDetails: any = [];
  segment: any;
  @Output() item = new EventEmitter<any>();
  constructor(
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public loading: LoadingService,
    public authservice: AuthService,
    private storage: StorageService
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
    this.getExamSchedule(event.CLASS_ID);
  }
  getExamSchedule(CLASS_ID: any) {
    this.show = false;
    this.schedule = [];
    if (CLASS_ID) {
      var storeData = { CLASS_ID: CLASS_ID };
      let timetable;
      this.loading.present();
      this.authservice.post('getExamSchedule', storeData).subscribe(
        (result: any) => {
          timetable = result;
          this.loading.dismissAll();
          if (timetable.status) {
            this.schedule = timetable.data;
          }
          this.show = true;
        },
        (err) => {
          this.loading.dismissAll();
          //Connection failed message
        }
      );
    } else {
      this.show = true;
    }
  }
}
