import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IWsRequestsStateJSON, NewWsRequestsStateJSON } from '../ws-requests-state-json.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWsRequestsStateJSON for edit and NewWsRequestsStateJSONFormGroupInput for create.
 */
type WsRequestsStateJSONFormGroupInput = IWsRequestsStateJSON | PartialWithRequiredKeyOf<NewWsRequestsStateJSON>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IWsRequestsStateJSON | NewWsRequestsStateJSON> = Omit<T, 'created'> & {
  created?: string | null;
};

type WsRequestsStateJSONFormRawValue = FormValueOf<IWsRequestsStateJSON>;

type NewWsRequestsStateJSONFormRawValue = FormValueOf<NewWsRequestsStateJSON>;

type WsRequestsStateJSONFormDefaults = Pick<NewWsRequestsStateJSON, 'id' | 'created'>;

type WsRequestsStateJSONFormGroupContent = {
  id: FormControl<WsRequestsStateJSONFormRawValue['id'] | NewWsRequestsStateJSON['id']>;
  requestId: FormControl<WsRequestsStateJSONFormRawValue['requestId']>;
  index: FormControl<WsRequestsStateJSONFormRawValue['index']>;
  cmdListJson: FormControl<WsRequestsStateJSONFormRawValue['cmdListJson']>;
  system: FormControl<WsRequestsStateJSONFormRawValue['system']>;
  created: FormControl<WsRequestsStateJSONFormRawValue['created']>;
};

export type WsRequestsStateJSONFormGroup = FormGroup<WsRequestsStateJSONFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WsRequestsStateJSONFormService {
  createWsRequestsStateJSONFormGroup(wsRequestsStateJSON: WsRequestsStateJSONFormGroupInput = { id: null }): WsRequestsStateJSONFormGroup {
    const wsRequestsStateJSONRawValue = this.convertWsRequestsStateJSONToWsRequestsStateJSONRawValue({
      ...this.getFormDefaults(),
      ...wsRequestsStateJSON,
    });
    return new FormGroup<WsRequestsStateJSONFormGroupContent>({
      id: new FormControl(
        { value: wsRequestsStateJSONRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      requestId: new FormControl(wsRequestsStateJSONRawValue.requestId),
      index: new FormControl(wsRequestsStateJSONRawValue.index),
      cmdListJson: new FormControl(wsRequestsStateJSONRawValue.cmdListJson),
      system: new FormControl(wsRequestsStateJSONRawValue.system),
      created: new FormControl(wsRequestsStateJSONRawValue.created),
    });
  }

  getWsRequestsStateJSON(form: WsRequestsStateJSONFormGroup): IWsRequestsStateJSON | NewWsRequestsStateJSON {
    return this.convertWsRequestsStateJSONRawValueToWsRequestsStateJSON(
      form.getRawValue() as WsRequestsStateJSONFormRawValue | NewWsRequestsStateJSONFormRawValue
    );
  }

  resetForm(form: WsRequestsStateJSONFormGroup, wsRequestsStateJSON: WsRequestsStateJSONFormGroupInput): void {
    const wsRequestsStateJSONRawValue = this.convertWsRequestsStateJSONToWsRequestsStateJSONRawValue({
      ...this.getFormDefaults(),
      ...wsRequestsStateJSON,
    });
    form.reset(
      {
        ...wsRequestsStateJSONRawValue,
        id: { value: wsRequestsStateJSONRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WsRequestsStateJSONFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      created: currentTime,
    };
  }

  private convertWsRequestsStateJSONRawValueToWsRequestsStateJSON(
    rawWsRequestsStateJSON: WsRequestsStateJSONFormRawValue | NewWsRequestsStateJSONFormRawValue
  ): IWsRequestsStateJSON | NewWsRequestsStateJSON {
    return {
      ...rawWsRequestsStateJSON,
      created: dayjs(rawWsRequestsStateJSON.created, DATE_TIME_FORMAT),
    };
  }

  private convertWsRequestsStateJSONToWsRequestsStateJSONRawValue(
    wsRequestsStateJSON: IWsRequestsStateJSON | (Partial<NewWsRequestsStateJSON> & WsRequestsStateJSONFormDefaults)
  ): WsRequestsStateJSONFormRawValue | PartialWithRequiredKeyOf<NewWsRequestsStateJSONFormRawValue> {
    return {
      ...wsRequestsStateJSON,
      created: wsRequestsStateJSON.created ? wsRequestsStateJSON.created.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
