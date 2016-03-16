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

module.exports=function(cwd){

    var startSign=function(){
        return logStream('start','yellow');
    };
    var endSign=function(){
        return logStream('finish','white');
    };

    gulp.task('css',function(){
        return gulp
            .src('./src/**/*.less',{cwd:cwd})
            .pipe(startSign())
            .pipe(lessStream({debug:false}))
            .pipe(minify())
            .pipe(renameStream(function(path){
                return path.replace(/\.less$/,'.css')
            }))
            .pipe(gulp.dest('./asset'))
            .pipe(endSign());
    });
    gulp.task('js',function(){
        return gulp
            .src(['./src/**/*.js'],{cwd:cwd})
            .pipe(startSign())
            .pipe(browserifyStream(function(err){
                return "console.log('+err+')";
            },{
                react:false,
                debug:false
            }))
            .pipe(uglify())
            .pipe(gulp.dest('./asset'))
            .pipe(endSign());
    });
    gulp.task('html',['css','js'],function(){
        return gulp
            .src('./src/**/*.html',{cwd:cwd})
            .pipe(startSign())
            .pipe(ejsStream({debug:false}))
            .pipe(md5Stream(cwd))
            .pipe(gulp.dest('./asset'))
            .pipe(endSign());
    });

    gulp.start('html');

};
