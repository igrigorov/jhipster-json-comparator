import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { BulkCompare, IBulkCompare } from '../bulk-compare.model';
import { BulkCompareService } from '../service/bulk-compare.service';

@Injectable({ providedIn: 'root' })
export class BulkCompareRoutingResolveService implements Resolve<IBulkCompare> {
  constructor(protected service: BulkCompareService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBulkCompare> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bulkCompare: HttpResponse<BulkCompare>) => {
          if (bulkCompare.body) {
            return of(bulkCompare.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BulkCompare());
  }
}
