import ajax from '../utils/ajax';

const lower = Function.prototype.call.bind(String.prototype.toLowerCase);
const upper = Function.prototype.call.bind(String.prototype.toUpperCase);

export async function rapidUploadOnce(dir, name, md5, md5s, size, ondup) {
  if (dir.slice(-1) !== '/') {
    dir += '/';
  }

  return ajax({
    url: '/api/rapidupload?rtype=1',
    type: 'POST',
    // https://github.com/iikira/BaiduPCS-Go/blob/9837f8e24328e5f881d6a07cf1249508c485a063/baidupcs/prepare.go#L272-L279
    data: {
      // overwrite: 表示覆盖同名文件; newcopy: 表示生成文件副本并进行重命名，命名规则为“文件名_日期.后缀”
      ondup,

      path: dir + name,
      'content-md5': md5,
      'slice-md5': md5s,
      'content-length': size,
      local_mtime: '',
    },
  });
}

export default async function rapidUpload(dir, file, ondup) {
  const {
    name,
    md5,
    md5s,
    size,
  } = file;

  // 先尝试小写，如果失败则尝试大写。如果都失败则不重试。
  const resp = await rapidUploadOnce(dir, name, lower(md5), lower(md5s), size, ondup);
  if (resp.errno === 0) {
    return resp;
  }
  return rapidUploadOnce(dir, name, upper(md5), upper(md5s), size, ondup);
}
