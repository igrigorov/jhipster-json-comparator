import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IComPair, ICompareResponse, NewComPair } from '../com-pair.model';

export type PartialUpdateComPair = Partial<IComPair> & Pick<IComPair, 'id'>;

export type EntityResponseType = HttpResponse<ICompareResponse>;
export type EntityArrayResponseType = HttpResponse<ICompareResponse[]>;

@Injectable({ providedIn: 'root' })
export class ComPairService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/compare-single');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  compare(comPair: NewComPair): Observable<EntityArrayResponseType> {
    return this.http.post<ICompareResponse[]>(this.resourceUrl, comPair, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICompareResponse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getComPairIdentifier(comPair: Pick<IComPair, 'id'>): number {
    return comPair.id;
  }

  getCompareResponseIdentifier(compareResponse: Pick<ICompareResponse, 'requestId'>): number {
    return compareResponse.requestId;
  }

  compareComPair(o1: Pick<IComPair, 'id'> | null, o2: Pick<IComPair, 'id'> | null): boolean {
    return o1 && o2 ? this.getComPairIdentifier(o1) === this.getComPairIdentifier(o2) : o1 === o2;
  }

  addComPairToCollectionIfMissing<Type extends Pick<IComPair, 'id'>>(
    comPairCollection: Type[],
    ...comPairsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const comPairs: Type[] = comPairsToCheck.filter(isPresent);
    if (comPairs.length > 0) {
      const comPairCollectionIdentifiers = comPairCollection.map(comPairItem => this.getComPairIdentifier(comPairItem)!);
      const comPairsToAdd = comPairs.filter(comPairItem => {
        const comPairIdentifier = this.getComPairIdentifier(comPairItem);
        if (comPairCollectionIdentifiers.includes(comPairIdentifier)) {
          return false;
        }
        comPairCollectionIdentifiers.push(comPairIdentifier);
        return true;
      });
      return [...comPairsToAdd, ...comPairCollection];
    }
    return comPairCollection;
  }
}
