import { getQuery, hasQuery } from '../utils/query';
import ImportOnLoad from './ImportOnLoad';
import { decodeBase64 } from '../utils/base64';

export default function initialiseQueryLink() {
  if (hasQuery('bdlink')) {
    ImportOnLoad.create(decodeBase64(getQuery('bdlink')));
  }
}
