import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IComPair, NewComPair } from '../com-pair.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IComPair for edit and NewComPairFormGroupInput for create.
 */
type ComPairFormGroupInput = IComPair | PartialWithRequiredKeyOf<NewComPair>;

type ComPairFormDefaults = Pick<NewComPair, 'id'>;

type ComPairFormGroupContent = {
  id: FormControl<IComPair['id'] | NewComPair['id']>;
  requestId: FormControl<IComPair['requestId']>;
  requestIdx: FormControl<IComPair['requestIdx']>;
  system1: FormControl<IComPair['system1']>;
  system2: FormControl<IComPair['system2']>;
};

export type ComPairFormGroup = FormGroup<ComPairFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ComPairFormService {
  createComPairFormGroup(comPair: ComPairFormGroupInput = { id: null }): ComPairFormGroup {
    const comPairRawValue = {
      ...this.getFormDefaults(),
      ...comPair,
    };
    return new FormGroup<ComPairFormGroupContent>({
      id: new FormControl(
        { value: comPairRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      requestId: new FormControl(comPairRawValue.requestId),
      requestIdx: new FormControl(comPairRawValue.requestIdx),
      system1: new FormControl(comPairRawValue.system1),
      system2: new FormControl(comPairRawValue.system2),
    });
  }

  getComPair(form: ComPairFormGroup): IComPair | NewComPair {
    return form.getRawValue() as IComPair | NewComPair;
  }

  resetForm(form: ComPairFormGroup, comPair: ComPairFormGroupInput): void {
    const comPairRawValue = { ...this.getFormDefaults(), ...comPair };
    form.reset(
      {
        ...comPairRawValue,
        id: { value: comPairRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ComPairFormDefaults {
    return {
      id: null,
    };
  }
}
