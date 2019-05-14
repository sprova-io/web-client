import { Location } from 'history';
import qs, { ParsedUrlQuery } from 'querystring';

export function parseQuery(location: Location): ParsedUrlQuery {
  return qs.parse(location.search.substring(1));
}
