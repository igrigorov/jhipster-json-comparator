import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWsRequestsStateJSON } from '../ws-requests-state-json.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-ws-requests-state-json-detail',
  templateUrl: './ws-requests-state-json-detail.component.html',
})
export class WsRequestsStateJSONDetailComponent implements OnInit {
  wsRequestsStateJSON: IWsRequestsStateJSON | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ wsRequestsStateJSON }) => {
      this.wsRequestsStateJSON = wsRequestsStateJSON;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
