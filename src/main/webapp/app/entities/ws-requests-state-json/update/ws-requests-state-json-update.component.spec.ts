import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WsRequestsStateJSONFormService } from './ws-requests-state-json-form.service';
import { WsRequestsStateJSONService } from '../service/ws-requests-state-json.service';
import { IWsRequestsStateJSON } from '../ws-requests-state-json.model';

import { WsRequestsStateJSONUpdateComponent } from './ws-requests-state-json-update.component';

describe('WsRequestsStateJSON Management Update Component', () => {
  let comp: WsRequestsStateJSONUpdateComponent;
  let fixture: ComponentFixture<WsRequestsStateJSONUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let wsRequestsStateJSONFormService: WsRequestsStateJSONFormService;
  let wsRequestsStateJSONService: WsRequestsStateJSONService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WsRequestsStateJSONUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(WsRequestsStateJSONUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WsRequestsStateJSONUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    wsRequestsStateJSONFormService = TestBed.inject(WsRequestsStateJSONFormService);
    wsRequestsStateJSONService = TestBed.inject(WsRequestsStateJSONService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const wsRequestsStateJSON: IWsRequestsStateJSON = { id: 456 };

      activatedRoute.data = of({ wsRequestsStateJSON });
      comp.ngOnInit();

      expect(comp.wsRequestsStateJSON).toEqual(wsRequestsStateJSON);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWsRequestsStateJSON>>();
      const wsRequestsStateJSON = { id: 123 };
      jest.spyOn(wsRequestsStateJSONFormService, 'getWsRequestsStateJSON').mockReturnValue(wsRequestsStateJSON);
      jest.spyOn(wsRequestsStateJSONService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wsRequestsStateJSON });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: wsRequestsStateJSON }));
      saveSubject.complete();

      // THEN
      expect(wsRequestsStateJSONFormService.getWsRequestsStateJSON).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(wsRequestsStateJSONService.update).toHaveBeenCalledWith(expect.objectContaining(wsRequestsStateJSON));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWsRequestsStateJSON>>();
      const wsRequestsStateJSON = { id: 123 };
      jest.spyOn(wsRequestsStateJSONFormService, 'getWsRequestsStateJSON').mockReturnValue({ id: null });
      jest.spyOn(wsRequestsStateJSONService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wsRequestsStateJSON: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: wsRequestsStateJSON }));
      saveSubject.complete();

      // THEN
      expect(wsRequestsStateJSONFormService.getWsRequestsStateJSON).toHaveBeenCalled();
      expect(wsRequestsStateJSONService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWsRequestsStateJSON>>();
      const wsRequestsStateJSON = { id: 123 };
      jest.spyOn(wsRequestsStateJSONService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ wsRequestsStateJSON });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(wsRequestsStateJSONService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
