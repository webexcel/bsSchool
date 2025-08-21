import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';

@Component({
  selector: 'app-annual-report',
  templateUrl: './annual-report.component.html',
  styleUrls: ['./annual-report.component.scss'],
})
export class AnnualReportComponent implements OnInit {
  ios: any = false;
  getStudentDetails: any = [];
  annualReport: any;
  adno: any;
  pdfData: any;
  pdf: any;

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

  ngOnInit() {}

  selected(event: any) {
    this.annualReport = [];
    this.get(event.ADNO);
  }

  get(ADNO: any) {
    this.loading.present();
    this.adno = ADNO;
    // let data = { adno: '1' };
    let data = { adno: this.adno };
    this.authservice.post('getAnnualReportcard', data).subscribe(
      (result: any) => {
        this.pdfData = result.url;
        this.loading.dismissAll();
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }
}
