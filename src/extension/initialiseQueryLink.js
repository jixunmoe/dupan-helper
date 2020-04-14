import Query from '../utils/Query';
import ImportOnLoad from './ImportOnLoad';
import { decodeBase64 } from '../utils/base64';

const KEY_BDLINK = 'bdlink';
const { search, hash } = window.location;

export default function initialiseQueryLink() {
  const query = new Query();

  query.parse(search);
  if (!query.has(KEY_BDLINK)) {
    query.parse(hash);
  }

  if (query.has(KEY_BDLINK)) {
    ImportOnLoad.create(decodeBase64(query.get(KEY_BDLINK).replace(/#.{4}$/, '')));
  }
}
