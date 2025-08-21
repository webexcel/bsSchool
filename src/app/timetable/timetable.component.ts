import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { DataService } from '../service/data.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
  // standalone: true,
  // imports: [IonicModule, CommonModule]
})
export class TimetableComponent implements OnInit {
  ios: any = false;
  currentOrientation: any;
  orientationChange: any;
  data: any = [];
  day: any = [];
  subject: any = [];
  keys: any = [];
  show: any = false;
  getStudentDetails: any = [];

  constructor(
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    private storage: StorageService,
    private dataservice: DataService,
    public authservice: AuthService,
    public loading: LoadingService
  ) {
    this.getStudentDetails = this.storage.getjson('studentDetail')[0];
    this.selected(this.getStudentDetails);

    this.platform.backButton.subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.lock(); 
  }

  lock = async () => {
    await ScreenOrientation.lock({ orientation: 'landscape' });
  };

  selected(event: any) {
    this.show = false;
    this.day = [];
    this.data = [];
    this.subject = [];
    this.getTimetable(event.CLASS_ID);
  }

  getTimetable(item: any) {
    var storeData = { CLASS_ID: item };

    this.loading.present();
    this.authservice.post('studenttimetable', storeData).subscribe(
      (result: any) => {
        if (result['status']) {
          this.data = result['data'];
          for (let i = 0; i < this.data.length; i++) {
            this.keys = Object.keys(this.data[i]);

            for (let x of this.keys) {
              if (x != 'day' && this.subject.indexOf(x) == -1) {
                this.subject.push(x);
              }
            }
          }
        }
        this.show = true;
        this.loading.dismissAll();
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }

  async unlock() {
    await ScreenOrientation.unlock();
  }
  // Lock to portrait
  async lockToPortrait() {
    await ScreenOrientation.lock({ orientation: 'portrait' });
  }
  // Lock to landscape
  async lockToLandscape() {
    await ScreenOrientation.lock({ orientation: 'landscape' });
  }

  ngOnDestroy() {
    this.unlock();
  }
}
