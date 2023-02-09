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
      {
        path: 'com-pair',
        data: { pageTitle: 'responseComparatorApp.comPair.home.title' },
        loadChildren: () => import('./com-pair/com-pair.module').then(m => m.ComPairModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
