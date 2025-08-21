import {Directive, Input, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[ngInit]'
})
export class NgInitDirective {

  @Input() isLast:any;

  @Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if (this.isLast) {
      setTimeout(() => this.initEvent.emit(), 5000);
    }
  }
}