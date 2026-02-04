const fs = require('fs');
const path = require('path');

exports.deleteFile = (filePath) => {
  if (!filePath) return;

  const absolutePath = path.join(
    __dirname,
    '..',
    '..',
    filePath
  );

  fs.unlink(absolutePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('File delete error:', err.message);
    }
  });
};