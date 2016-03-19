var path=require('path');
var fs=require('graceful-fs');

// 创建文件夹
var createDir=function(dirPath){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }
};

var option=require('../tool.js').getOption();

module.exports=function(dirname){

    var offlineDir=option.offlineDir;
    var onlineDir=option.onlineDir;
    var jsDir=option.jsDir;
    var cssDir=option.cssDir;
    var widgetDir=option.widgetDir;

    // 资源文件目录
    createDir(path.join(dirname,offlineDir));
    // 资源文件 js文件目录
    createDir(path.join(dirname,offlineDir,jsDir));
    // 资源文件 css文件目录
    createDir(path.join(dirname,offlineDir,cssDir));

    // 线上文件目录
    createDir(path.join(dirname,onlineDir));
    // 线上文件 js文件目录
    createDir(path.join(dirname,onlineDir,jsDir));
    // 线上文件 css文件目录
    createDir(path.join(dirname,onlineDir,cssDir));
    // 公用模块目录
    createDir(path.join(dirname,widgetDir));

};
