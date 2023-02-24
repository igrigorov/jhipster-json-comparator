import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BulkCompareModel, IBulkCompare } from '../bulk-compare.model';
import { BulkCompareService } from '../service/bulk-compare.service';
// import { NgxSpinnerService } from 'ngx-spinner';
import { ICompareResponse } from 'app/entities/com-pair/com-pair.model';

@Component({
  selector: 'soap-compare-bulk-compare',
  templateUrl: './bulk-compare.component.html',
  styleUrls: ['./bulk-compare.component.scss'],
})
export class BulkCompareComponent implements OnInit {
  bulkCompares?: IBulkCompare[];
  isLoading = false;
  bulkCompareForm = new FormGroup({
    bulkCompareFile: new FormControl('', Validators.required),
  });
  file: File = new File(['foo'], 'foo.txt', {
    type: 'text/plain',
  });
  fileName = '';
  bulkModel: BulkCompareModel = new BulkCompareModel(this.file);
  response: ICompareResponse[] | undefined;

  constructor(protected bulkCompareService: BulkCompareService /*, protected spinnerService: NgxSpinnerService*/) {}

  loadAll(): void {
    // this.isLoading = true;
    //
    // this.bulkCompareService.query().subscribe(
    //   (res: HttpResponse<IBulkCompare[]>) => {
    //     this.isLoading = false;
    //     this.bulkCompares = res.body ?? [];
    //   },
    //   () => {
    //     this.isLoading = false;
    //   }
    // );
  }

  getFile(event: any): void {
    this.file = event.target.files.item(0);
  }

  submitBulkCompare(): void {
    // this.spinnerService.show();
    this.bulkModel = new BulkCompareModel(this.file);
    this.bulkCompareService.sendForm(this.bulkModel).subscribe(data => {
      this.response = data.body!;
      console.log('Return data');
      console.log(data);
      // this.spinnerService.hide();
    });
  }

  showFileName(event: any): void {
    const input = event.target;

    // the input has an array of files in the `files` property, each one has a name that you can use. We're just using the name here.
    this.fileName = input.files[0].name;
    this.file = input.files.item(0);
  }

  resetForm(): void {
    this.bulkCompareForm.reset();
    this.fileName = '';
    this.response = undefined;
  }

  print(): void {
    window.print();
  }

  getSucceededLines(): string {
    const totalLines = this.response?.length;
    let succeeded = 0;
    this.response?.forEach(line => {
      if (line?.result?.code === 0) {
        succeeded++;
      }
    });

    return String(succeeded) + '/' + String(totalLines);
  }

  getFailedLines(): string {
    const totalLines = this.response?.length;
    let failed = 0;
    this.response?.forEach(line => {
      if (line?.result?.code === 0) {
        failed++;
      }
    });

    return String(failed) + '/' + String(totalLines);
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBulkCompare): number {
    return item.id!;
  }
}
