var path=require('path');
var fs=require('graceful-fs');
var createDir=function(dirPath){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }
};
var option=require('../option.json');
module.exports=function(dirname){

    var offlineDir=option.offlineDir;
    var onlineDir=option.onlineDir;
    var jsDir=option.jsDir;
    var cssDir=option.cssDir;
    var widgetDir=option.widgetDir;

    createDir(path.join(dirname,offlineDir));
    createDir(path.join(dirname,offlineDir,jsDir));
    createDir(path.join(dirname,offlineDir,cssDir));

    createDir(path.join(dirname,onlineDir));
    createDir(path.join(dirname,onlineDir,jsDir));
    createDir(path.join(dirname,onlineDir,cssDir));

    createDir(path.join(dirname,widgetDir));

};
