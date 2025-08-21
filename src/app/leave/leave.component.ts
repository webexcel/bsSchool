import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, Platform } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthService } from '../service/auth.service';
import { DataService } from '../service/data.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
})
export class LeaveComponent implements OnInit {
  ios: any = false;
  select_datas: any = {};
  select_datas1: any = {};
  @ViewChild(IonModal)
  modal!: IonModal;
  isPickerOpen: boolean = false;
  showDatePicker: boolean = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private translate: TranslateConfigService,
    private storage: StorageService,
    private dataservice: DataService,
    public authservice: AuthService,
    public loading: LoadingService
  ) {
    this.platform.backButton.subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  ngOnInit() {
    this.ios = this.authservice.isiso();
    this.reset();
  }

  reset() {
    this.select_datas.s_date = new Date().toISOString();
    this.select_datas1.s_date = new Date().toISOString();
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

  toggleDateSelection() {
    this.isPickerOpen = !this.isPickerOpen;
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

  showHideDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onSubmit(form: NgForm) {
    this.loading.present();
    this.authservice.post('saveHomeworkMessage', this.select_datas).subscribe(
      (res: any) => {
        this.loading.dismissAll();
        if (res['status']) {
          form.resetForm();
          // this.reset();
        }
      },
      (err) => {
        this.loading.dismissAll();
      }
    );
  }
}
