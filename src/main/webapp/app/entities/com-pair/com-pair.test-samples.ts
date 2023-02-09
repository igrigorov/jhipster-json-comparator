import { IComPair, NewComPair } from './com-pair.model';

export const sampleWithRequiredData: IComPair = {
  id: 11785,
};

export const sampleWithPartialData: IComPair = {
  id: 16575,
  requestId: 21374,
  system1: 'National calculating',
};

export const sampleWithFullData: IComPair = {
  id: 37936,
  requestId: 42848,
  requestIdx: 66717,
  system1: 'override Liaison',
  system2: 'azure',
};

export const sampleWithNewData: NewComPair = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
