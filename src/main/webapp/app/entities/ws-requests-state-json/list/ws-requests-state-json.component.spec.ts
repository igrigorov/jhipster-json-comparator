import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WsRequestsStateJSONService } from '../service/ws-requests-state-json.service';

import { WsRequestsStateJSONComponent } from './ws-requests-state-json.component';

describe('WsRequestsStateJSON Management Component', () => {
  let comp: WsRequestsStateJSONComponent;
  let fixture: ComponentFixture<WsRequestsStateJSONComponent>;
  let service: WsRequestsStateJSONService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'ws-requests-state-json', component: WsRequestsStateJSONComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [WsRequestsStateJSONComponent],
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
      .overrideTemplate(WsRequestsStateJSONComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WsRequestsStateJSONComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WsRequestsStateJSONService);

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
    expect(comp.wsRequestsStateJSONS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to wsRequestsStateJSONService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getWsRequestsStateJSONIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getWsRequestsStateJSONIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
