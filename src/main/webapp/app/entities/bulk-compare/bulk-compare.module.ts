import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BulkCompareComponent } from './list/bulk-compare.component';
import { BulkCompareRoutingModule } from './route/bulk-compare-routing.module';

// import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [SharedModule, BulkCompareRoutingModule /*, NgxSpinnerModule*/],
  declarations: [BulkCompareComponent],
})
export class BulkCompareModule {}
