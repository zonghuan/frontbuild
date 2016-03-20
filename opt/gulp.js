// 打包

var browserifyStream=require('../stream/browserify.js');
var lessStream=require('../stream/less.js');
var ejsStream=require('../stream/ejs.js');
var logStream=require('../stream/log.js');
var renameStream=require('../stream/rename.js');
var md5Stream=require('../stream/md5.js');

var gulp=require('gulp');
var util=require('gulp-util');
var through=require('through2');
var uglify=require('gulp-uglify');
var minify=require('gulp-minify-css');

var fs=require('fs');
var option=require('../tool.js').getOption();
var offlineDir=option.offlineDir;
var onlineDir=option.onlineDir;

module.exports=function(cwd){

    var startSign=function(){
        return logStream('start','yellow');
    };
    var endSign=function(){
        return logStream('finish','white');
    };
    // 打包css
    gulp.task('css',function(){
        return gulp
            .src('./'+offlineDir+'/**/*.less',{cwd:cwd})
            // 开始的log输出
            .pipe(startSign())
            // less
            .pipe(lessStream({debug:false}))
            // 代码压缩
            .pipe(minify())
            // less文件 -> css文件
            .pipe(renameStream(function(path){
                return path.replace(/\.less$/,'.css')
            }))
            .pipe(gulp.dest('./'+onlineDir))
            .pipe(endSign());
    });
    // 打包js
    gulp.task('js',function(){
        return gulp
            .src(['./'+offlineDir+'/**/*.js'],{cwd:cwd})
            .pipe(startSign())
            // 使用browserify 解析js
            .pipe(browserifyStream(function(err){
                return "console.log('+err+')";
            },{
                react:false,
                debug:false
            }))
            // 压缩代码
            .pipe(uglify())
            .pipe(gulp.dest('./'+onlineDir))
            .pipe(endSign());
    });
    // 打包jsx
    gulp.task('jsx',function(){
        return gulp
            .src(['./'+offlineDir+'/**/*.jsx'],{cwd:cwd})
            .pipe(startSign())
            // browserify解析jsx
            .pipe(browserifyStream(function(err){
                return "console.log('+err+')";
            },{
                react:true,
                debug:false
            }))
            // 代码压缩
            .pipe(uglify())
            // 文件重命名 .jsx -> .js
            .pipe(renameStream(function(path){
                return path.replace(/\.jsx$/,'.js')
            }))
            .pipe(gulp.dest('./'+onlineDir))
            .pipe(endSign());
    });
    // 打包html文件
    gulp.task('html',['css','js','jsx'],function(){
        return gulp
            .src('./'+offlineDir+'/**/*.html',{cwd:cwd})
            .pipe(startSign())
            // ejs解析
            .pipe(ejsStream({debug:false}))
            // 为解析出来的html文件内的js css文件添加md5戳
            .pipe(md5Stream(cwd))
            .pipe(gulp.dest('./'+onlineDir))
            .pipe(endSign());
    });
    // 记录每个asset下的文件 写入./asset.json中
    var version=function(){
        var md5Obj={};
        var md5Transform=function(data) {
            var buf = new Buffer(data);
            var str = buf.toString("binary");
            var crypto = require("crypto");
            return crypto.createHash("md5").update(str).digest("hex");
        };

        return function(){
            require('gulp-util').log(util.colors['blue']('version start'));
            return gulp
                .src('./'+onlineDir+'/**/*.*',{cwd:cwd})
                .pipe(through.obj(function(file,env,cb){
                    md5Obj[file.relative]=md5Transform(file.toString());
                    cb(null,file);
                })).on('end',function(){
                    fs.writeFileSync('./asset.json',JSON.stringify(md5Obj),'utf-8');
                    require('gulp-util').log(util.colors['blue']('version finish'));
                });
        };
    };
    gulp.task('build',['html'],version());

    gulp.start('build');

};
