import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BulkCompareComponent } from '../list/bulk-compare.component';

const bulkCompareRoute: Routes = [
  {
    path: '',
    component: BulkCompareComponent,
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bulkCompareRoute)],
  exports: [RouterModule],
})
export class BulkCompareRoutingModule {}
