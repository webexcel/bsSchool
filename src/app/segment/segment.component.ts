import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
})
export class SegmentComponent implements OnInit {
  getStudentDetails: any = [];
  selected: any;
  @Output() item = new EventEmitter<any>();
  segment: any;
  constructor(private storage: StorageService) {
    this.getStudentDetails = this.storage.getjson('studentDetail');
    this.segment = this.getStudentDetails[0];
  }

  ngOnInit() {}

  segmentButtonClicked(event: any, item: any) {
    event.target.scrollIntoView({
      behavior: 'smooth', //  smooth value triggers smooth scroll.
      inline: 'center',
    });
    this.item.emit(item);
  }
}
