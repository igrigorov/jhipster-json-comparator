import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ws-requests-state-json.test-samples';

import { WsRequestsStateJSONFormService } from './ws-requests-state-json-form.service';

describe('WsRequestsStateJSON Form Service', () => {
  let service: WsRequestsStateJSONFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsRequestsStateJSONFormService);
  });

  describe('Service methods', () => {
    describe('createWsRequestsStateJSONFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWsRequestsStateJSONFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            requestId: expect.any(Object),
            requestIdx: expect.any(Object),
            cmdListJson: expect.any(Object),
            srcSystem: expect.any(Object),
            created: expect.any(Object),
          })
        );
      });

      it('passing IWsRequestsStateJSON should create a new form with FormGroup', () => {
        const formGroup = service.createWsRequestsStateJSONFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            requestId: expect.any(Object),
            requestIdx: expect.any(Object),
            cmdListJson: expect.any(Object),
            srcSystem: expect.any(Object),
            created: expect.any(Object),
          })
        );
      });
    });

    describe('getWsRequestsStateJSON', () => {
      it('should return NewWsRequestsStateJSON for default WsRequestsStateJSON initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWsRequestsStateJSONFormGroup(sampleWithNewData);

        const wsRequestsStateJSON = service.getWsRequestsStateJSON(formGroup) as any;

        expect(wsRequestsStateJSON).toMatchObject(sampleWithNewData);
      });

      it('should return NewWsRequestsStateJSON for empty WsRequestsStateJSON initial value', () => {
        const formGroup = service.createWsRequestsStateJSONFormGroup();

        const wsRequestsStateJSON = service.getWsRequestsStateJSON(formGroup) as any;

        expect(wsRequestsStateJSON).toMatchObject({});
      });

      it('should return IWsRequestsStateJSON', () => {
        const formGroup = service.createWsRequestsStateJSONFormGroup(sampleWithRequiredData);

        const wsRequestsStateJSON = service.getWsRequestsStateJSON(formGroup) as any;

        expect(wsRequestsStateJSON).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWsRequestsStateJSON should not enable id FormControl', () => {
        const formGroup = service.createWsRequestsStateJSONFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWsRequestsStateJSON should disable id FormControl', () => {
        const formGroup = service.createWsRequestsStateJSONFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
