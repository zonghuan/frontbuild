var gulp=require('gulp');
var browserify=require('browserify');
var through=require('through2');
var reactify=require('reactify');


// browserify -> gulp
var getBrowserifyStream=function(cb,option){

    option=option||{
        react:false,
        debug:true
    };

	// js transform : 将js文件用reactify转换
	var bTransform=function(file){
		return reactify(file,{'es6':true});
	};

	return through.obj(function(file,env,callback){

		// browserify解析js
		var b=browserify({
            "entries":file.path,
            debug:option.debug
        });

        if(option.react===true){
            b.transform(bTransform);
        }

		b.bundle(function(err,buffer){

			if(err){
				// browserify解析错误 输出错误信息
				file.contents=new Buffer(cb(err.toString()));

                if(option.debug){
                    callback(null,file);
                }else{
                    callback(err,file);
                }

                return;
			}

			file.contents=buffer;
			callback(null,file);

		});

	});
};
module.exports=getBrowserifyStream;
