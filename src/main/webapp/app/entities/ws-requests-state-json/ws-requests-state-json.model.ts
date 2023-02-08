import dayjs from 'dayjs/esm';

export interface IWsRequestsStateJSON {
  id: number;
  requestId?: number | null;
  index?: number | null;
  cmdListJson?: string | null;
  system?: string | null;
  created?: dayjs.Dayjs | null;
}

export type NewWsRequestsStateJSON = Omit<IWsRequestsStateJSON, 'id'> & { id: null };
