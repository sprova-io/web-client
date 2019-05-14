import _ from 'lodash';

export function findById<T, I = string>(
  data: T[],
  id: I,
  attr = '_id'
): T | undefined {
  // @ts-ignore
  return _.find(data, (item: T) => (item[attr] as I) === id)!;
}
