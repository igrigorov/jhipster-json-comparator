import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ComPairComponent } from '../list/com-pair.component';
import { ComPairUpdateComponent } from '../update/com-pair-update.component';
import { ComPairRoutingResolveService } from './com-pair-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const comPairRoute: Routes = [
  {
    path: '',
    component: ComPairComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ComPairUpdateComponent,
    resolve: {
      comPair: ComPairRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ComPairUpdateComponent,
    resolve: {
      comPair: ComPairRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(comPairRoute)],
  exports: [RouterModule],
})
export class ComPairRoutingModule {}
