import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from, of, Subject } from 'rxjs';

import { ComPairFormService } from './com-pair-form.service';
import { ComPairService } from '../service/com-pair.service';
import { IComPair } from '../com-pair.model';

import { ComPairUpdateComponent } from './com-pair-update.component';

describe('ComPair Management Update Component', () => {
  let comp: ComPairUpdateComponent;
  let fixture: ComponentFixture<ComPairUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let comPairFormService: ComPairFormService;
  let comPairService: ComPairService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ComPairUpdateComponent],
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
      .overrideTemplate(ComPairUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ComPairUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    comPairFormService = TestBed.inject(ComPairFormService);
    comPairService = TestBed.inject(ComPairService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const comPair: IComPair = { id: 456 };

      activatedRoute.data = of({ comPair });
      comp.ngOnInit();

      expect(comp.comPair).toEqual(comPair);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComPair>>();
      const comPair = { id: 123 };
      jest.spyOn(comPairFormService, 'getComPair').mockReturnValue(comPair);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comPair });
      comp.ngOnInit();

      // WHEN
      comp.compare();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comPair }));
      saveSubject.complete();

      // THEN
      expect(comPairFormService.getComPair).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComPair>>();
      const comPair = { id: 123 };
      jest.spyOn(comPairFormService, 'getComPair').mockReturnValue({ id: null });
      jest.spyOn(comPairService, 'compare').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comPair: null });
      comp.ngOnInit();

      // WHEN
      comp.compare();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comPair }));
      saveSubject.complete();

      // THEN
      expect(comPairFormService.getComPair).toHaveBeenCalled();
      expect(comPairService.compare).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComPair>>();
      const comPair = { id: 123 };
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comPair });
      comp.ngOnInit();

      // WHEN
      comp.compare();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
