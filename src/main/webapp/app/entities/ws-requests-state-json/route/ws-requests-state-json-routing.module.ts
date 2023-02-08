import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WsRequestsStateJSONComponent } from '../list/ws-requests-state-json.component';
import { WsRequestsStateJSONDetailComponent } from '../detail/ws-requests-state-json-detail.component';
import { WsRequestsStateJSONUpdateComponent } from '../update/ws-requests-state-json-update.component';
import { WsRequestsStateJSONRoutingResolveService } from './ws-requests-state-json-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const wsRequestsStateJSONRoute: Routes = [
  {
    path: '',
    component: WsRequestsStateJSONComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WsRequestsStateJSONDetailComponent,
    resolve: {
      wsRequestsStateJSON: WsRequestsStateJSONRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WsRequestsStateJSONUpdateComponent,
    resolve: {
      wsRequestsStateJSON: WsRequestsStateJSONRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WsRequestsStateJSONUpdateComponent,
    resolve: {
      wsRequestsStateJSON: WsRequestsStateJSONRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(wsRequestsStateJSONRoute)],
  exports: [RouterModule],
})
export class WsRequestsStateJSONRoutingModule {}
