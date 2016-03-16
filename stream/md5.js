var through=require('through2');
var fs=require('fs');
var path=require('path');

// 获取相应页面的md5
var getMd5=function(path) {
	var data=fs.readFileSync(path,'utf8');
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5").update(str).digest("hex");
};
// 为html文件内的js css路径添加md5
module.exports=function(cwd){

	// 处理html文件的流
	return through.obj(function(file,env,callback){

		var html=file.contents.toString();

		// 获取css链接的正则
		var cssReg=/(\<link.+?href\=["'])(.+?)(["'])/g;
		// 获取js链接的正则
		var scriptReg=/(\<script.+?src\=["'])(.+?)(["'])/g;

		// 根据transformSrcFunc获得目标路径
		var replaceFunc=function(transformSrcFunc){

			return function(s,$1,$2,$3){

				// src->dist
				var distPath=transformSrcFunc($2);

				// 获取目标文件的全路径
				var fullPath=path.join(cwd,'asset',distPath);
				var md5='';

				if(distPath.indexOf('?')!==-1){
					// 路径中带有参数 去掉问号之后的字符串
					fullPath=fullPath.split('?')[0];
				}

				if(fs.existsSync(fullPath)){
					// 假如存在目标文件 读取它的md5
					md5=getMd5(fullPath);
				}else{
					// 不存在该文件 则不加md5
					return s;
				}

				if(distPath.indexOf('?')===-1){
					return $1+distPath+'?v='+md5+$3;
				}else{
					// 若html中js css文件已经带有参数
					return $1+distPath+'&v='+md5+$3;
				}
			};
		};

		// 生成script替换函数
		var replaceScriptFunc=replaceFunc(function(src){

			return src.trim()
				// 替换路径
                .replace(/\.jsx$/,'.js');

		});

		// 生成css替换函数
		var replaceCssFunc=replaceFunc(function(src){

			return src.trim()
				// 替换扩展名
				.replace(/\.less/,'.css');

		});

		// 获得最终的html
		var result=html.replace(scriptReg,replaceScriptFunc)
				.replace(cssReg,replaceCssFunc);

		file.contents=new Buffer(result,'utf8');
		callback(null,file);

	});
};
