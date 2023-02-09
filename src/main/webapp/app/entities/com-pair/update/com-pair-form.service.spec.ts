import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../com-pair.test-samples';

import { ComPairFormService } from './com-pair-form.service';

describe('ComPair Form Service', () => {
  let service: ComPairFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComPairFormService);
  });

  describe('Service methods', () => {
    describe('createComPairFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createComPairFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            requestId: expect.any(Object),
            requestIdx: expect.any(Object),
            system1: expect.any(Object),
            system2: expect.any(Object),
          })
        );
      });

      it('passing IComPair should create a new form with FormGroup', () => {
        const formGroup = service.createComPairFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            requestId: expect.any(Object),
            requestIdx: expect.any(Object),
            system1: expect.any(Object),
            system2: expect.any(Object),
          })
        );
      });
    });

    describe('getComPair', () => {
      it('should return NewComPair for default ComPair initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createComPairFormGroup(sampleWithNewData);

        const comPair = service.getComPair(formGroup) as any;

        expect(comPair).toMatchObject(sampleWithNewData);
      });

      it('should return NewComPair for empty ComPair initial value', () => {
        const formGroup = service.createComPairFormGroup();

        const comPair = service.getComPair(formGroup) as any;

        expect(comPair).toMatchObject({});
      });

      it('should return IComPair', () => {
        const formGroup = service.createComPairFormGroup(sampleWithRequiredData);

        const comPair = service.getComPair(formGroup) as any;

        expect(comPair).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IComPair should not enable id FormControl', () => {
        const formGroup = service.createComPairFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewComPair should disable id FormControl', () => {
        const formGroup = service.createComPairFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
