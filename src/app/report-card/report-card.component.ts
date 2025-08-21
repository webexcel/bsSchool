import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';
@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss'],
})
export class ReportCardComponent implements OnInit {
  ios: any = false;
  data: any = [];
  exams: any = [];
  subject: any = [];
  show: any = false; currentStudent: any;
  getStudentDetails: any = [];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'bar';
  public lineChartLabels: Array<any> | undefined;
  public lineChartData: Array<any> | undefined;
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  constructor(
    private storage: StorageService,
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public loading: LoadingService,
    public authservice: AuthService
  ) {
    this.getStudentDetails = this.storage.getjson('studentDetail')[0];
    this.lock();
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
    this.currentStudent = event;
    this.show = false;
    this.exams = [];
    this.data = [];
    this.subject = [];
    this.getMarks(event.ADMISSION_ID);
  }

  lock = async () => {
    await ScreenOrientation.lock({ orientation: 'landscape' });
  };

  getMarks(item: any) {
    var storeData = { ADNO: item };

    this.loading.present();
    this.authservice.post('getMarksOnAdno', storeData).subscribe(
      (result: any) => {
        if (result['status']) {
          this.data = result['data'];

          for (let i = 0; i < this.data.length; i++) {
            this.exams.push(this.data[i]['EXAM']);
            const keys = Object.keys(this.data[i]);
            for (let x of keys) {
              if (x != 'EXAM' && this.subject.indexOf(x) == -1) {
                this.subject.push(x);
              }
            }
          }
        }
        this.lineChartLabels = this.subject;
        let l = [];
        for (let i = 0; i < this.data.length; i++) {
          let data = [];
          let label = [this.data[i]['EXAM']];
          for (let j = 0; j < this.subject.length; j++) {
            data.push(this.data[i][this.subject[j]]);
          }
          l.push({ data: data, label: label });
          `   `;
        }
        this.lineChartData = l;

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

  ngOnDestroy() {
    this.unlock();
  }

  async changeScreen() {
    const orientationInfo = await ScreenOrientation.orientation();
    if (orientationInfo.type == "portrait-primary") {
      await ScreenOrientation.lock({ orientation: 'landscape' });
    } else {
      await ScreenOrientation.lock({ orientation: 'portrait' });
    }
    this.selected(this.currentStudent);
  }
}
