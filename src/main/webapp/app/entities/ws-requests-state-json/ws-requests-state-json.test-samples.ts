import dayjs from 'dayjs/esm';

import { IWsRequestsStateJSON, NewWsRequestsStateJSON } from './ws-requests-state-json.model';

export const sampleWithRequiredData: IWsRequestsStateJSON = {
  id: 49698,
};

export const sampleWithPartialData: IWsRequestsStateJSON = {
  id: 21168,
};

export const sampleWithFullData: IWsRequestsStateJSON = {
  id: 95435,
  requestId: 28896,
  index: 34821,
  cmdListJson: '../fake-data/blob/hipster.txt',
  system: 'hacking Fuerte Car',
  created: dayjs('2023-02-07T08:42'),
};

export const sampleWithNewData: NewWsRequestsStateJSON = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
