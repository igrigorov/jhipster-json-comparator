import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { BulkCompareModel, IBulkCompare } from '../bulk-compare.model';
import { ICompareResponse } from 'app/entities/com-pair/com-pair.model';

export type EntityResponseType = HttpResponse<IBulkCompare>;
export type EntityArrayResponseType = HttpResponse<IBulkCompare[]>;

@Injectable({ providedIn: 'root' })
export class BulkCompareService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/bulk-compare');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBulkCompare>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBulkCompare[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  sendForm(bulkCompareForm: BulkCompareModel): Observable<HttpResponse<ICompareResponse[]>> {
    const formData: FormData = new FormData();
    formData.append('file', bulkCompareForm.file);
    return this.http.post<ICompareResponse[]>(`${this.resourceUrl}`, formData, { observe: 'response' });
  }
}
