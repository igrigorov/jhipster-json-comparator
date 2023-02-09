import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ComPairService } from '../service/com-pair.service';

import { ComPairComponent } from './com-pair.component';

describe('ComPair Management Component', () => {
  let comp: ComPairComponent;
  let fixture: ComponentFixture<ComPairComponent>;
  let service: ComPairService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'com-pair', component: ComPairComponent }]), HttpClientTestingModule],
      declarations: [ComPairComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ComPairComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ComPairComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ComPairService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.compareResponses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to comPairService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getComPairIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getComPairIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
