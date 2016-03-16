var through=require('through2');

module.exports=function(transform){
    return through.obj(function(file,env,cb){
        file.path=transform(file.path);
        cb(null,file);
    });
}
