var ejs=require('ejs');
var through=require('through2');
var path=require('path');

module.exports=function(option){

    return through.obj(function(file,env,cb){
        var result='';
        try{
            result=ejs.render(file.contents.toString(),{},{
                filename:file.path
            });
            file.contents=new Buffer(result);
            cb(null,file);

        }catch(e){
            // 若解析错误  输出错误信息
            file.contents=new Buffer(e.toString());

            if(option.debug===true){
                // debug模式 错误不往下传
                cb(null,file);
            }else{
                // 非debug模式 错误传下去 停止打包的过程 
                cb(e,file);
            }
        }

    });

};
