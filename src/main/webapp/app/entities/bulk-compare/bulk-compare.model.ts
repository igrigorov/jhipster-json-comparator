export interface IBulkCompare {
  id?: number;
}

export class BulkCompare implements IBulkCompare {
  constructor(public id?: number) {}
}

export class BulkCompareModel {
  constructor(public file: File) {}
}

export function getBulkCompareIdentifier(bulkCompare: IBulkCompare): number | undefined {
  return bulkCompare.id;
}
