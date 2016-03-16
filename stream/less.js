var less=require('less');
var through=require('through2');

module.exports=function(option){

    return through.obj(function(file,env,cb){

        less.render(file.contents.toString(),{
            filename:file.path
        },function(e,output){

            if(e){
                file.contents=new Buffer('less 解析错误:'+e);
                if(option.debug===true){
                    cb(null,file);
                }else{
                    cb(e,file);
                }
                return;
            }
            file.contents=new Buffer(output.css);
            cb(null,file);

        });

    });

};
