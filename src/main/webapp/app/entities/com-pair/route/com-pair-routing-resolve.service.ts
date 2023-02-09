import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IComPair } from '../com-pair.model';
import { ComPairService } from '../service/com-pair.service';

@Injectable({ providedIn: 'root' })
export class ComPairRoutingResolveService implements Resolve<IComPair | null> {
  constructor(protected service: ComPairService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IComPair | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((comPair: HttpResponse<IComPair>) => {
          if (comPair.body) {
            return of(comPair.body);
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
