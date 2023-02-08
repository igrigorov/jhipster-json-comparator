import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { WsRequestsStateJSONFormService, WsRequestsStateJSONFormGroup } from './ws-requests-state-json-form.service';
import { IWsRequestsStateJSON } from '../ws-requests-state-json.model';
import { WsRequestsStateJSONService } from '../service/ws-requests-state-json.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-ws-requests-state-json-update',
  templateUrl: './ws-requests-state-json-update.component.html',
})
export class WsRequestsStateJSONUpdateComponent implements OnInit {
  isSaving = false;
  wsRequestsStateJSON: IWsRequestsStateJSON | null = null;

  editForm: WsRequestsStateJSONFormGroup = this.wsRequestsStateJSONFormService.createWsRequestsStateJSONFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected wsRequestsStateJSONService: WsRequestsStateJSONService,
    protected wsRequestsStateJSONFormService: WsRequestsStateJSONFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ wsRequestsStateJSON }) => {
      this.wsRequestsStateJSON = wsRequestsStateJSON;
      if (wsRequestsStateJSON) {
        this.updateForm(wsRequestsStateJSON);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('responseComparatorApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const wsRequestsStateJSON = this.wsRequestsStateJSONFormService.getWsRequestsStateJSON(this.editForm);
    if (wsRequestsStateJSON.id !== null) {
      this.subscribeToSaveResponse(this.wsRequestsStateJSONService.update(wsRequestsStateJSON));
    } else {
      this.subscribeToSaveResponse(this.wsRequestsStateJSONService.create(wsRequestsStateJSON));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWsRequestsStateJSON>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(wsRequestsStateJSON: IWsRequestsStateJSON): void {
    this.wsRequestsStateJSON = wsRequestsStateJSON;
    this.wsRequestsStateJSONFormService.resetForm(this.editForm, wsRequestsStateJSON);
  }
}
