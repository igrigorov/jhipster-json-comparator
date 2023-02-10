export interface IComPair {
  id: number;
  requestId?: number | null;
  requestIdx?: number | null;
  system1?: string | null;
  system2?: string | null;
}

export type NewComPair = Omit<IComPair, 'id'> & { id: null };

interface ICompareResult {
  code: number;
  message: string;
  diff?: string[] | null;
}

export interface ICompareResponse {
  requestId: number;
  requestIdx?: number | null;
  response?: ICompareResult | null;
}
