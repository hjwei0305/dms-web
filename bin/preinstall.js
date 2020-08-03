const { exec } = require('child_process');

exec('npm config get registry', err => {
  if (!err) {
    // TODO: stdout.toString 判断是否为公司组件库地址，不是的设置公司私有库地址
    exec('  npm config set registry http://202.98.157.109:8081/repository/npm_group/');
  }
});
