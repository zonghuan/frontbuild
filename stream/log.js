var util=require('gulp-util');
var through=require('through2');

module.exports=function(text,color){
    color=color||'blur';
	return through.obj(function(file,env,callback){

		// 输出log
		util.log(util.colors[color](file.relative)+' '+text);
		callback(null,file);

	});
};
