import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWsRequestsStateJSON, NewWsRequestsStateJSON } from '../ws-requests-state-json.model';

export type PartialUpdateWsRequestsStateJSON = Partial<IWsRequestsStateJSON> & Pick<IWsRequestsStateJSON, 'id'>;

type RestOf<T extends IWsRequestsStateJSON | NewWsRequestsStateJSON> = Omit<T, 'created'> & {
  created?: string | null;
};

export type RestWsRequestsStateJSON = RestOf<IWsRequestsStateJSON>;

export type NewRestWsRequestsStateJSON = RestOf<NewWsRequestsStateJSON>;

export type PartialUpdateRestWsRequestsStateJSON = RestOf<PartialUpdateWsRequestsStateJSON>;

export type EntityResponseType = HttpResponse<IWsRequestsStateJSON>;
export type EntityArrayResponseType = HttpResponse<IWsRequestsStateJSON[]>;

@Injectable({ providedIn: 'root' })
export class WsRequestsStateJSONService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ws-requests-state-jsons');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(wsRequestsStateJSON: NewWsRequestsStateJSON): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(wsRequestsStateJSON);
    return this.http
      .post<RestWsRequestsStateJSON>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(wsRequestsStateJSON: IWsRequestsStateJSON): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(wsRequestsStateJSON);
    return this.http
      .put<RestWsRequestsStateJSON>(`${this.resourceUrl}/${this.getWsRequestsStateJSONIdentifier(wsRequestsStateJSON)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(wsRequestsStateJSON: PartialUpdateWsRequestsStateJSON): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(wsRequestsStateJSON);
    return this.http
      .patch<RestWsRequestsStateJSON>(`${this.resourceUrl}/${this.getWsRequestsStateJSONIdentifier(wsRequestsStateJSON)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestWsRequestsStateJSON>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestWsRequestsStateJSON[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWsRequestsStateJSONIdentifier(wsRequestsStateJSON: Pick<IWsRequestsStateJSON, 'id'>): number {
    return wsRequestsStateJSON.id;
  }

  compareWsRequestsStateJSON(o1: Pick<IWsRequestsStateJSON, 'id'> | null, o2: Pick<IWsRequestsStateJSON, 'id'> | null): boolean {
    return o1 && o2 ? this.getWsRequestsStateJSONIdentifier(o1) === this.getWsRequestsStateJSONIdentifier(o2) : o1 === o2;
  }

  addWsRequestsStateJSONToCollectionIfMissing<Type extends Pick<IWsRequestsStateJSON, 'id'>>(
    wsRequestsStateJSONCollection: Type[],
    ...wsRequestsStateJSONSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const wsRequestsStateJSONS: Type[] = wsRequestsStateJSONSToCheck.filter(isPresent);
    if (wsRequestsStateJSONS.length > 0) {
      const wsRequestsStateJSONCollectionIdentifiers = wsRequestsStateJSONCollection.map(
        wsRequestsStateJSONItem => this.getWsRequestsStateJSONIdentifier(wsRequestsStateJSONItem)!
      );
      const wsRequestsStateJSONSToAdd = wsRequestsStateJSONS.filter(wsRequestsStateJSONItem => {
        const wsRequestsStateJSONIdentifier = this.getWsRequestsStateJSONIdentifier(wsRequestsStateJSONItem);
        if (wsRequestsStateJSONCollectionIdentifiers.includes(wsRequestsStateJSONIdentifier)) {
          return false;
        }
        wsRequestsStateJSONCollectionIdentifiers.push(wsRequestsStateJSONIdentifier);
        return true;
      });
      return [...wsRequestsStateJSONSToAdd, ...wsRequestsStateJSONCollection];
    }
    return wsRequestsStateJSONCollection;
  }

  protected convertDateFromClient<T extends IWsRequestsStateJSON | NewWsRequestsStateJSON | PartialUpdateWsRequestsStateJSON>(
    wsRequestsStateJSON: T
  ): RestOf<T> {
    return {
      ...wsRequestsStateJSON,
      created: wsRequestsStateJSON.created?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restWsRequestsStateJSON: RestWsRequestsStateJSON): IWsRequestsStateJSON {
    return {
      ...restWsRequestsStateJSON,
      created: restWsRequestsStateJSON.created ? dayjs(restWsRequestsStateJSON.created) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestWsRequestsStateJSON>): HttpResponse<IWsRequestsStateJSON> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestWsRequestsStateJSON[]>): HttpResponse<IWsRequestsStateJSON[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
