import dayjs from 'dayjs/esm';

export interface IWsRequestsStateJSON {
  id: number;
  requestId?: number | null;
  requestIdx?: number | null;
  cmdListJson?: string | null;
  srcSystem?: string | null;
  created?: dayjs.Dayjs | null;
}

export type NewWsRequestsStateJSON = Omit<IWsRequestsStateJSON, 'id'> & { id: null };
