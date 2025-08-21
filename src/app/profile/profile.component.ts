import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, Platform } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AuthService } from '../service/auth.service';
import { LoadingService } from '../service/loading.service';
import { StorageService } from '../service/storage.service';
import { TranslateConfigService } from '../service/translate-config.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  ios: any = false;
  details: any = {};
  adno: any = '';
  show: any = false;
  getStudentDetails: any = [];
  showDatePicker: boolean = false;
  bloodGrp: any[] = []; isDatePickerOpen: boolean = false; s_date: any;

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
    this.bloodGrp = [
      {id: "1", name: "A+ve"},
      {id: "2", name: "A-ve"},
      {id: "3", name: "B+ve"},
      {id: "4", name: "B-ve"},
      {id: "5", name: "O+ve"},
      {id: "6", name: "O-ve"},
      {id: "7", name: "AB+ve"},
      {id: "8", name: "AB-ve"},
    ];
    this.s_date = new Date().toISOString();
  }

  selected(event: any) {
    this.details = {};
    this.show = false;
    this.get(event.ADNO);
  }

  get(ADNO: any) {
    this.loading.present();
    this.adno = ADNO;
    let data = { adno: this.adno };
    this.authservice.post('getIdcard', data).subscribe(
      (result: any) => {
        if (result['status']) {
          let l = result['data'][0];
          this.details.adno = l["ADMISSION_ID"];
          this.details.parent = l['fname'];
          this.details.dob = l['dob'];
          let id = this.bloodGrp.filter((event: any) => event.id == l['bg']);
          this.details.bg = id[0]?.id;
          if (l['address']) {
            let address = l['address'].split(', ');
            if (address.length == 4) {
              this.details.house_no = address[0];
              this.details.street = address[1];
              this.details.address = address[2];
              this.details.city = address[3].split(' - ')[0];
              this.details.pincode = address[3].split(' - ')[1];
            }
          }
          if (l['contact']) {
            this.details.con_no_1 = l['contact'].split('/')[0];
            this.details.con_no_2 = l['contact'].split('/')[1];
          }
        }
        this.loading.dismissAll();
        this.show = true;
      },
      (err) => {
        this.loading.dismissAll();
        //Connection failed message
      }
    );
  }

  namedata(data: any) {
    data.target.value = data.target.value.replace(/[^A-Za-z0-9 ]/g, '');
    return data.target.value
      ? data.target.value.charAt(0).toUpperCase() +
          data.target.value.substr(1).toLowerCase()
      : '';
  }

  phonedata(data: any) {
    return data.target.value.replace(/[^0-9.]/g, '');
  }
  pincodedata(data: any) {
    return data.target.value.replace(/[^0-9.]/g, '');
  }

  onSubmit() {
    this.loading.present();
    let address = `${this.details.house_no}, ${this.details.street}, ${this.details.address}, ${this.details.city} - ${this.details.pincode}`;
    let contact = `${this.details.con_no_1}/${this.details.con_no_2}`;

    let data = {
      fname: this.details.parent,
      adno: this.adno,
      dob: this.details.dob,
      bg: this.details.bg,
      address: address,
      contact: contact,
    };

    this.authservice.post('updateIdcard', data).subscribe(
      (result) => {
        this.get(this.adno);
        this.loading.dismissAll();
      },
      (err) => {
        this.loading.dismissAll();
        //Connection failed message
      }
    );
  }

  showHideDatePicker() {
    this.showDatePicker = !this.showDatePicker;
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

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.details.dob = this.s_date;
    this.modal.dismiss(null, 'confirm');
  }

  toggleDateSelect() {
    this.s_date = this.details.dob;
    this.isDatePickerOpen = !this.isDatePickerOpen;
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'cancel') {
      this.details.dob = null;
    }
  }
}
