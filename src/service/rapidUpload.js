import ajax from '../utils/ajax';

const toLowerCase = Function.prototype.call.bind(String.prototype.toLowerCase);

export default async function rapidUpload(dir, file, ondup) {
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

      path: dir + file.name,
      'content-md5': toLowerCase(file.md5),
      'slice-md5': toLowerCase(file.md5s),
      'content-length': file.size,
      local_mtime: '',
    },
  });
}
