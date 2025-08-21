import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KnowledgeBasePageRoutingModule } from './knowledge-base-routing.module';

import { SegmentModule } from '../segment/segment.module';
import { KnowledgeBasePage } from './knowledge-base.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KnowledgeBasePageRoutingModule,
    SegmentModule
  ],
  declarations: [KnowledgeBasePage]
})
export class KnowledgeBasePageModule {}
