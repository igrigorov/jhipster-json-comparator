import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IWsRequestsStateJSON } from '../ws-requests-state-json.model';
import { WsRequestsStateJSONService } from '../service/ws-requests-state-json.service';

import { WsRequestsStateJSONRoutingResolveService } from './ws-requests-state-json-routing-resolve.service';

describe('WsRequestsStateJSON routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: WsRequestsStateJSONRoutingResolveService;
  let service: WsRequestsStateJSONService;
  let resultWsRequestsStateJSON: IWsRequestsStateJSON | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(WsRequestsStateJSONRoutingResolveService);
    service = TestBed.inject(WsRequestsStateJSONService);
    resultWsRequestsStateJSON = undefined;
  });

  describe('resolve', () => {
    it('should return IWsRequestsStateJSON returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWsRequestsStateJSON = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultWsRequestsStateJSON).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWsRequestsStateJSON = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultWsRequestsStateJSON).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IWsRequestsStateJSON>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultWsRequestsStateJSON = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultWsRequestsStateJSON).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
