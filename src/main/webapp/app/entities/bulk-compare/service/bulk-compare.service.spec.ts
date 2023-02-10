import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBulkCompare } from '../bulk-compare.model';

import { BulkCompareService } from './bulk-compare.service';

describe('Service Tests', () => {
  describe('BulkCompare Service', () => {
    let service: BulkCompareService;
    let httpMock: HttpTestingController;
    let elemDefault: IBulkCompare;
    let expectedResult: IBulkCompare | IBulkCompare[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BulkCompareService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should return a list of BulkCompare', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      describe('addBulkCompareToCollectionIfMissing', () => {
        // it('should add only unique BulkCompare to an array', () => {
        //   const bulkCompareArray: IBulkCompare[] = [{ id: 123 }, { id: 456 }, { id: 90549 }];
        //   const bulkCompareCollection: IBulkCompare[] = [{ id: 123 }];
        //   expectedResult = service.addBulkCompareToCollectionIfMissing(bulkCompareCollection, ...bulkCompareArray);
        //   expect(expectedResult).toHaveLength(3);
        // });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
