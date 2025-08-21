import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { TranModule } from '../tran.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    TranModule,
    PinchZoomModule,
  ],
})
export class LoginModule {}
