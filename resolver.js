const fs = require("fs");
const path = require("path");

function getFilesSync(dir, filelist) {
  const files = fs.readdirSync(dir);
  let file = "";
  let i = 0;
  const length = files.length;

  for (i; i < length; i++) {
    file = path.join(dir, files[i]);

    if (fs.statSync(file).isDirectory()) {
      filelist = getFilesSync(file, filelist);
    } else if (file.slice(-3) === ".js") {
      filelist.push(file);
    }
  }
  return filelist;
}

const fileList = getFilesSync(path.join(process.cwd(), "src"), []);
const fileMap = fileList.reduce((a, v) => {
  a[path.parse(v).name] = v;
  return a;
}, {});

module.exports = function(moduleName, details) {
  if (moduleName in fileMap) {
    return fileMap[moduleName];
  }

  const { defaultResolver } = details;
  return defaultResolver(moduleName, details);
};
