var express=require('express');
var app=express();

var fs=require('graceful-fs');
var path=require('path');
var vfs=require('vinyl-fs');

// 线下模式 将错误显示到浏览器上
var showError=function(content) {
    return [
        "var div = document.createElement('pre') ;",
        'div.innerHTML = "' + content.replace(/\\/g, '\/').replace(/\n/g, '<br/><br/>') + '";',
        "div.style.width = '14rem';div.style.backgroundColor = '#000' ;",
        "div.style.padding = '5px 5px 5px 15px' ; div.style.margin = '0 auto' ;",
        "div.style.left = '0' ;div.style.right = '0' ;",
        "div.style.position = 'fixed' ; div.style.borderRadius = '3px' ;",
        "div.style.boxShadow = '0 0 1rem rgba(0,0,0,.3)' ;div.style.top='5rem';",
        "div.style.fontSize = '.6rem' ;div.style.color = '#fff' ;div.style.zIndex = '999' ;",
        "div.style.wordBreak = 'break-word' ;",
        "document.querySelector('body').appendChild(div);"
    ].join('');
}

var through=require('through2');

// res -> stream
var resStream=function(res){
    return through.obj(function(file,env,cb){
        res.end(file.contents.toString());
        cb(null,file);
    });
};

var handleFactory=function(type,rootPath){

    var jsHandle=function(type){
        var browserify=require('../stream/browserify.js');
        return function(req,res){

            var file=path.join(rootPath,req.path);

            res.setHeader('Content-Type','text/javascript');
            if(!fs.existsSync(file)){
                res.end(showError('找不到文件:'+file));
                return;
            }

            vfs.src(file,{read:false})
                .pipe(browserify(showError,{
                    react:type==='jsx',
                    debug:true
                }))
                .pipe(resStream(res));
        };

    };

    var map={
        "js":jsHandle('js'),
        "jsx":jsHandle('jsx'),
        "less":function(req,res){

            var lessParse=require('../stream/less.js');
            var filePath=path.join(rootPath,req.path);

            res.setHeader('Content-Type','text/css');
            if(!fs.existsSync(filePath)){
                res.end('找不到文件:'+filePath);
                return;
            }

            vfs.src(filePath)
                .pipe(lessParse({debug:true}))
                .pipe(resStream(res));
        },
        "html":function(req,res){
            var htmlParse=require('../stream/ejs.js');
            res.setHeader('Content-Type','text/html');
            var filePath=path.join(rootPath,req.path);
            if(!fs.existsSync(filePath)){
                res.end('找不到文件:'+filePath);
                return;
            }
            vfs.src(filePath)
                .pipe(htmlParse({debug:true}))
                .pipe(resStream(res));

        }
    };
    return map[type]||map['js'];
};

module.exports=function(port,rootPath){

    app.get('/js/*.js',handleFactory('js',rootPath));
    app.get('/js/*.jsx',handleFactory('jsx',rootPath));
    app.get('/css/*.less',handleFactory('less',rootPath));
    app.get('/*.html',handleFactory('html',rootPath));

    app.listen(port,function(){
        console.log('start offline mode,server listen on '+port);
    });

};
