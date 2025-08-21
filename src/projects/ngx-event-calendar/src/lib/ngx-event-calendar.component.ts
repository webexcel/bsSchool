import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { EventData } from './interface/event-data';
import { yearsLabel } from './locale/years';
import { formatDate } from '@angular/common';
import { mounthsEN } from './locale/monthsEN';
import { weekdayEN } from './locale/weekdaysEN';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslateConfigService } from 'src/app/service/translate-config.service';
TranslateConfigService
@Component({
  selector: 'ngx-event-calendar',
  templateUrl: './ngx-event-calendar.component.html',
  styleUrls: ['./ngx-event-calendar.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('250ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('250ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  
  ]

})
export class NgxEventCalendarComponent implements OnInit {


  isSmall = false;

  today;
  currentMonth;
  currentYear;
  firstDay:any;
  daysInMonth:any;
  daysInLastMonth:any;
  actDay:any;
  lastMonth:any;
  actMonth:any;
  months: any = mounthsEN;
  weekdays: any = weekdayEN;
  years:any = [];
  actFullDate:any;
  actDate: any;
  arrTest: any= [];
  arrCalendar : any= [];
  eventsData: any;
  actYear:any;
  showChangeDate = false;
  btnAddShow:any;
  @Input() dataSource: EventData[] | undefined;
  @Input() showAddButton: boolean | undefined;

  @Output() dayEvents = new EventEmitter();
  @Output() newEvent = new EventEmitter();

  constructor(private translate: TranslateConfigService) {
    this.today = new Date();
    this.currentMonth = this.today.getMonth();
    this.currentYear = this.today.getFullYear();
    this.years = yearsLabel;
  }

  ngOnInit() {
    this.translate.set()
    this.actFullDate = formatDate(new Date(), 'yyyy. MMMM. dd', 'en');
    this.actDate = formatDate(new Date(), 'yyyy. MMMM', 'en');
    this.actDay = formatDate(new Date(), 'dd', 'en');
    this.actMonth = formatDate(new Date(), 'MM', 'en');
    this.actYear = formatDate(new Date(), 'yyyy', 'en');
    this.eventsData = this.dataSource;
    this.btnAddShow = this.showAddButton;
  }

  ngAfterViewInit(): void {
    const height = document.getElementById('cont')?.offsetHeight ?? 0;
    const width = document.getElementById('cont')?.offsetWidth ?? 0;

    // TODO: if small only show badges not all the events
    if (height <= 500 || width <= 769) {
      this.isSmall = true;
    } else {
      this.isSmall = false;
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    const height = document.getElementById('cont')?.offsetHeight ?? 0;
    const width = document.getElementById('cont')?.offsetWidth ?? 0;
    if (height <= 500 || width <= 600) {
      this.isSmall = true;
    } else {
      this.isSmall = false;
    }
  }

  ngOnChanges() {
    this.eventsData = this.dataSource;

    this.createCalendar();
  }

  createCalendar() {
    this.arrTest = [];
    this.arrCalendar = [];
    this.firstDay = new Date(this.currentYear, this.currentMonth).getUTCDay();
    this.daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.daysInLastMonth = this.getDaysInMonth(
      this.currentMonth - 1,
      this.currentYear
    );
    const lmd = this.daysInLastMonth - (this.firstDay - 1);

    // Last month days
    for (let index = lmd; index <= this.daysInLastMonth; index++) {
      this.arrTest.push({
        day: index,
        month: this.currentMonth - 1,
        year: this.currentYear,
      });
    }

    // Actual month
    for (let index = 1; index <= this.daysInMonth; index++) {
      const filterEvents = this.eventsData.filter((event: any) => {
        return (
          event.startDate <=
          new Date(
            this.currentYear,
            this.currentMonth,
            index + 1
          ).getTime() &&
          event.endDate >=
          new Date(this.currentYear, this.currentMonth, index).getTime()
        );
      });

      //Sorted events by date
      const arrSortedEventsByDate = filterEvents.sort((a:any, b:any) => {
        return a.startDate - b.startDate
      });

      this.arrTest.push({
        day: index,
        month: this.currentMonth,
        year: this.currentYear,
        events: arrSortedEventsByDate
      });

      

    }

    for (let i = this.arrTest.length, j = 1; i < 42; i++ , j++) {
      this.arrTest.push({
        day: j,
        month: this.currentMonth + 1,
        year: this.currentYear,
      });
    }

    for (let i = 0; i < 6; i++) {
      const arrWeek = this.arrTest.splice(0, 7);
      this.arrCalendar.push(arrWeek);
    }

  }

  getDaysInMonth(iMonth:any, iYear:any) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  previousMonthButtonClick() {
    if (this.currentMonth === 0) {
      this.currentYear -= 1;
      this.currentMonth = 11;
    } else {
      this.currentMonth -= 1;
    }

    this.actDate = this.creatActMonthYear();

    this.createCalendar();
  }

  nextMonthButtonClick() {
    if (this.currentMonth === 11) {
      this.currentYear += 1;
      this.currentMonth = 0;
    } else {
      this.currentMonth += 1;
    }

    this.actDate = this.creatActMonthYear();

    this.createCalendar();
  }

  // Dialog test
  // TODO: return the selected value
  openDialog(event:any) {
    this.dayEvents.next(event);
  }

  

  onYearChange(event:any) {
    this.currentYear = Number(event.value);

    this.actDate = this.creatActMonthYear();
    this.createCalendar();
  }

  onMonthChange(event:any) {
    this.currentMonth = Number(event.value);

    this.actDate = this.creatActMonthYear();
 

    this.createCalendar();
  }

  creatActMonthYear() {
    const actDate = formatDate(
      new Date(this.currentYear, this.currentMonth),
      'yyyy. MMMM',
      'en'
    );

    return actDate;
  }

  addEventClicked() {

    const testMessage = `${this.currentYear}-${this.currentMonth}-${this.actDay}`;
    this.newEvent.next(testMessage);
  }


}
