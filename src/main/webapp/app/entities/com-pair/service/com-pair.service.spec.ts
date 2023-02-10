import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IComPair } from '../com-pair.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../com-pair.test-samples';

import { ComPairService } from './com-pair.service';

const requireRestSample: IComPair = {
  ...sampleWithRequiredData,
};

describe('ComPair Service', () => {
  let service: ComPairService;
  let httpMock: HttpTestingController;
  let expectedResult: IComPair | IComPair[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ComPairService);
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

    it('should create a ComPair', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const comPair = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.compare(comPair).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ComPair', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    describe('addComPairToCollectionIfMissing', () => {
      it('should add a ComPair to an empty array', () => {
        const comPair: IComPair = sampleWithRequiredData;
        expectedResult = service.addComPairToCollectionIfMissing([], comPair);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(comPair);
      });

      it('should not add a ComPair to an array that contains it', () => {
        const comPair: IComPair = sampleWithRequiredData;
        const comPairCollection: IComPair[] = [
          {
            ...comPair,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addComPairToCollectionIfMissing(comPairCollection, comPair);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ComPair to an array that doesn't contain it", () => {
        const comPair: IComPair = sampleWithRequiredData;
        const comPairCollection: IComPair[] = [sampleWithPartialData];
        expectedResult = service.addComPairToCollectionIfMissing(comPairCollection, comPair);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(comPair);
      });

      it('should add only unique ComPair to an array', () => {
        const comPairArray: IComPair[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const comPairCollection: IComPair[] = [sampleWithRequiredData];
        expectedResult = service.addComPairToCollectionIfMissing(comPairCollection, ...comPairArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const comPair: IComPair = sampleWithRequiredData;
        const comPair2: IComPair = sampleWithPartialData;
        expectedResult = service.addComPairToCollectionIfMissing([], comPair, comPair2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(comPair);
        expect(expectedResult).toContain(comPair2);
      });

      it('should accept null and undefined values', () => {
        const comPair: IComPair = sampleWithRequiredData;
        expectedResult = service.addComPairToCollectionIfMissing([], null, comPair, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(comPair);
      });

      it('should return initial array if no ComPair is added', () => {
        const comPairCollection: IComPair[] = [sampleWithRequiredData];
        expectedResult = service.addComPairToCollectionIfMissing(comPairCollection, undefined, null);
        expect(expectedResult).toEqual(comPairCollection);
      });
    });

    describe('compareComPair', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareComPair(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareComPair(entity1, entity2);
        const compareResult2 = service.compareComPair(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareComPair(entity1, entity2);
        const compareResult2 = service.compareComPair(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareComPair(entity1, entity2);
        const compareResult2 = service.compareComPair(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
