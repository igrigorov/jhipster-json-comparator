import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ComPairFormGroup, ComPairFormService } from './com-pair-form.service';
import { IComPair } from '../com-pair.model';
import { ComPairService } from '../service/com-pair.service';

@Component({
  selector: 'jhi-com-pair-update',
  templateUrl: './com-pair-update.component.html',
})
export class ComPairUpdateComponent implements OnInit {
  isSaving = false;
  comPair: IComPair | null = null;

  editForm: ComPairFormGroup = this.comPairFormService.createComPairFormGroup();

  constructor(
    protected comPairService: ComPairService,
    protected comPairFormService: ComPairFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comPair }) => {
      this.comPair = comPair;
      if (comPair) {
        this.updateForm(comPair);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  compare(): void {
    this.isSaving = true;
    const comPair = this.comPairFormService.getComPair(this.editForm);
    if (comPair.id !== null) {
      this.subscribeToSaveResponse(this.comPairService.update(comPair));
    } else {
      this.subscribeToSaveResponse(this.comPairService.compare(comPair));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComPair>>): void {
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

  protected updateForm(comPair: IComPair): void {
    this.comPair = comPair;
    this.comPairFormService.resetForm(this.editForm, comPair);
  }
}
