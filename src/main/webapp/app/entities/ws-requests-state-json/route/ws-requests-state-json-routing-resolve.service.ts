import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWsRequestsStateJSON } from '../ws-requests-state-json.model';
import { WsRequestsStateJSONService } from '../service/ws-requests-state-json.service';

@Injectable({ providedIn: 'root' })
export class WsRequestsStateJSONRoutingResolveService implements Resolve<IWsRequestsStateJSON | null> {
  constructor(protected service: WsRequestsStateJSONService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWsRequestsStateJSON | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((wsRequestsStateJSON: HttpResponse<IWsRequestsStateJSON>) => {
          if (wsRequestsStateJSON.body) {
            return of(wsRequestsStateJSON.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
