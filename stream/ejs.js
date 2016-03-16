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
            file.contents=new Buffer(e.toString());

            if(option.debug===true){
                cb(null,file);
            }else{
                cb(e,file);
            }
        }

    });

};
