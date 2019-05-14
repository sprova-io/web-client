import _ from 'lodash';
import moment from 'moment';

export function formatDuration(from: Date, to: Date) {
  const fromMillis = from.getTime();
  const toMillis = to.getTime();

  const duration = moment.duration(toMillis - fromMillis);

  const hours = duration.hours().toString();
  const minutes = duration.minutes().toString();
  const seconds = duration.seconds().toString();

  const pad = (time: string) => _.padStart(time, 2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
