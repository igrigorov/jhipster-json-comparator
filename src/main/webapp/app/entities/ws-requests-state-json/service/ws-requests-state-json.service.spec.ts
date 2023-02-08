import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWsRequestsStateJSON } from '../ws-requests-state-json.model';
import { sampleWithFullData, sampleWithPartialData, sampleWithRequiredData } from '../ws-requests-state-json.test-samples';

import { RestWsRequestsStateJSON, WsRequestsStateJSONService } from './ws-requests-state-json.service';

const requireRestSample: RestWsRequestsStateJSON = {
  ...sampleWithRequiredData,
  created: sampleWithRequiredData.created?.toJSON(),
};

describe('WsRequestsStateJSON Service', () => {
  let service: WsRequestsStateJSONService;
  let httpMock: HttpTestingController;
  let expectedResult: IWsRequestsStateJSON | IWsRequestsStateJSON[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WsRequestsStateJSONService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of WsRequestsStateJSON', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    describe('addWsRequestsStateJSONToCollectionIfMissing', () => {
      it('should add a WsRequestsStateJSON to an empty array', () => {
        const wsRequestsStateJSON: IWsRequestsStateJSON = sampleWithRequiredData;
        expectedResult = service.addWsRequestsStateJSONToCollectionIfMissing([], wsRequestsStateJSON);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(wsRequestsStateJSON);
      });

      it('should not add a WsRequestsStateJSON to an array that contains it', () => {
        const wsRequestsStateJSON: IWsRequestsStateJSON = sampleWithRequiredData;
        const wsRequestsStateJSONCollection: IWsRequestsStateJSON[] = [
          {
            ...wsRequestsStateJSON,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWsRequestsStateJSONToCollectionIfMissing(wsRequestsStateJSONCollection, wsRequestsStateJSON);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a WsRequestsStateJSON to an array that doesn't contain it", () => {
        const wsRequestsStateJSON: IWsRequestsStateJSON = sampleWithRequiredData;
        const wsRequestsStateJSONCollection: IWsRequestsStateJSON[] = [sampleWithPartialData];
        expectedResult = service.addWsRequestsStateJSONToCollectionIfMissing(wsRequestsStateJSONCollection, wsRequestsStateJSON);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(wsRequestsStateJSON);
      });

      it('should add only unique WsRequestsStateJSON to an array', () => {
        const wsRequestsStateJSONArray: IWsRequestsStateJSON[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const wsRequestsStateJSONCollection: IWsRequestsStateJSON[] = [sampleWithRequiredData];
        expectedResult = service.addWsRequestsStateJSONToCollectionIfMissing(wsRequestsStateJSONCollection, ...wsRequestsStateJSONArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const wsRequestsStateJSON: IWsRequestsStateJSON = sampleWithRequiredData;
        const wsRequestsStateJSON2: IWsRequestsStateJSON = sampleWithPartialData;
        expectedResult = service.addWsRequestsStateJSONToCollectionIfMissing([], wsRequestsStateJSON, wsRequestsStateJSON2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(wsRequestsStateJSON);
        expect(expectedResult).toContain(wsRequestsStateJSON2);
      });

      it('should accept null and undefined values', () => {
        const wsRequestsStateJSON: IWsRequestsStateJSON = sampleWithRequiredData;
        expectedResult = service.addWsRequestsStateJSONToCollectionIfMissing([], null, wsRequestsStateJSON, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(wsRequestsStateJSON);
      });

      it('should return initial array if no WsRequestsStateJSON is added', () => {
        const wsRequestsStateJSONCollection: IWsRequestsStateJSON[] = [sampleWithRequiredData];
        expectedResult = service.addWsRequestsStateJSONToCollectionIfMissing(wsRequestsStateJSONCollection, undefined, null);
        expect(expectedResult).toEqual(wsRequestsStateJSONCollection);
      });
    });

    describe('compareWsRequestsStateJSON', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWsRequestsStateJSON(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWsRequestsStateJSON(entity1, entity2);
        const compareResult2 = service.compareWsRequestsStateJSON(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWsRequestsStateJSON(entity1, entity2);
        const compareResult2 = service.compareWsRequestsStateJSON(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWsRequestsStateJSON(entity1, entity2);
        const compareResult2 = service.compareWsRequestsStateJSON(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
