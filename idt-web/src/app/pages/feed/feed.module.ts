import { NgModule } from '@angular/core';
import { FeedComponent } from './feed/feed.component';
import { FeedItemComponent } from './feed-item/feed-item.component';
import { FeedRoutingModule } from './feed.routing.module';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { CompanyItemComponent } from './company-item/company-item.component';

@NgModule({
  declarations: [FeedComponent, FeedItemComponent, CompanyItemComponent],
  imports: [
    CommonModule,
    FeedRoutingModule,
    MaterialModule
  ]
})
export class FeedModule { }
