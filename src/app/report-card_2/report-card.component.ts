import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  show: any = false;
  getStudentDetails: any = [];
  lineChartLegend: boolean = false;
  lineChartType: any = 'bar';
  lineChartLabels: any;
  lineChartData: any;
  lineChartOptions: any = {
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
  segment: any; currentIndex: any; chartData: any[] = []; passMark: any = 35; passColor: any = "#6fff6f"; failColor: any = "#ff6f6f";

  constructor(
    private storage: StorageService,
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    public loading: LoadingService,
    public authservice: AuthService
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
    this.show = false;
    this.exams = [];
    this.data = [];
    this.subject = [];
    this.getMarks(event.ADMISSION_ID);
  }

  selectedExam(data: any, index: any) {
    this.segment = data;
    this.currentIndex = index;
    this.chartData = this.lineChartData != undefined && this.lineChartData.length > 0 ? [this.lineChartData[index]] : [];
    if (this.chartData[0]) {
      this.chartData[0]["backgroundColor"] = [];
      this.chartData[0]["borderColor"] = [];
      this.chartData[0]["borderWidth"] = 1;
      for (let i = 0; i < this.chartData[0].data.length; i++) {
        if (this.chartData[0].data[i] >= this.passMark) {
          this.chartData[0].backgroundColor.push(this.passColor);
          this.chartData[0].borderColor.push(this.passColor);
        } else {
          this.chartData[0].backgroundColor.push(this.failColor);
          this.chartData[0].borderColor.push(this.failColor);
        }
      }
    }  
  }

  getMarks(item: any) {
    var storeData = { ADNO: item };

    this.loading.present();
    this.authservice.post('getMarksOnAdno', storeData).subscribe(
      (result: any) => {
        if (result['status']) {
          this.data = result['data'];

          for (let i = 0; i < this.data.length; i++) {
            this.exams.push(this.data[i]['EXAM']);
            this.segment = this.exams.length > 0 ? this.exams[0] : null;
            this.currentIndex = this.segment != null ? 0 : undefined;
            this.selectedExam(this.segment, 0);
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
            let mark = this.data[i][this.subject[j]]?.split('/')[0];
            data.push(mark);
          }
          l.push({ data: data, label: label });
          `   `;
        }
        this.lineChartData = l;
        this.chartData = this.lineChartData != undefined && this.lineChartData.length > 0 ? [this.lineChartData[0]] : [];
        if (this.chartData[0]) {
          this.chartData[0]["backgroundColor"] = [];
          this.chartData[0]["borderColor"] = [];
          this.chartData[0]["borderWidth"] = 1;
          for (let i = 0; i < this.chartData[0].data.length; i++) {
            if (this.chartData[0].data[i] >= this.passMark) {
              this.chartData[0].backgroundColor.push(this.passColor);
              this.chartData[0].borderColor.push(this.passColor);
            } else {
              this.chartData[0].backgroundColor.push(this.failColor);
              this.chartData[0].borderColor.push(this.failColor);
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

  onChartClick(event: any) {
    if (event.active && event.active.length > 0) {
      const activePoint = event.active[0];
      
      // Get dataset index and index of the clicked element
      const datasetIndex = activePoint.datasetIndex;
      const index = activePoint.index;
  
      // Access raw data, label, and dataset label
      const rawValue = this.lineChartData[datasetIndex].data[index];
      const label = this.lineChartLabels[index];
      const datasetLabel = this.lineChartData[datasetIndex].label;
  
      if (this.exams.indexOf(datasetLabel[0]) > -1) {
        this.selectedExam(datasetLabel[0], this.exams.indexOf(datasetLabel[0]));
      }
    } else {
      console.log('No active point found.');
    }
  }
}
