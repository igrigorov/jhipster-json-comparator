import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BulkCompareService } from '../service/bulk-compare.service';

import { BulkCompareComponent } from './bulk-compare.component';

describe('Component Tests', () => {
  describe('BulkCompare Management Component', () => {
    let comp: BulkCompareComponent;
    let fixture: ComponentFixture<BulkCompareComponent>;
    let service: BulkCompareService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BulkCompareComponent],
      })
        .overrideTemplate(BulkCompareComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BulkCompareComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BulkCompareService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
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
      expect(comp.bulkCompares?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
