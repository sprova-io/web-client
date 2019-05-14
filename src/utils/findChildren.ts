import _ from 'lodash';

export function findChildren<T, I = string>(
  data: T[],
  pid: I,
  attr = 'parentId'
) {
  // @ts-ignore
  return _.filter(data, (item: T) => (item[attr] as I) === pid);
}
