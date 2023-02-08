import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WsRequestsStateJSONComponent } from './list/ws-requests-state-json.component';
import { WsRequestsStateJSONDetailComponent } from './detail/ws-requests-state-json-detail.component';
import { WsRequestsStateJSONRoutingModule } from './route/ws-requests-state-json-routing.module';

@NgModule({
  imports: [SharedModule, WsRequestsStateJSONRoutingModule],
  declarations: [WsRequestsStateJSONComponent, WsRequestsStateJSONDetailComponent],
})
export class WsRequestsStateJSONModule {}
