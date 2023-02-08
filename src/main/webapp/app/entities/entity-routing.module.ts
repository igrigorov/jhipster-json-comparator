import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'ws-requests-state-json',
        data: { pageTitle: 'responseComparatorApp.wsRequestsStateJSON.home.title' },
        loadChildren: () => import('./ws-requests-state-json/ws-requests-state-json.module').then(m => m.WsRequestsStateJSONModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
