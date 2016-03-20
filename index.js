#!/usr/bin/env node

var program=require('commander');
var path=require('path');
var cwd=process.cwd();
var package=require('./package.json');

var option=require('./tool.js').getOption();

var offlineDir=option.offlineDir;
var onlineDir=option.onlineDir;
var jsDir=option.jsDir;
var cssDir=option.cssDir;

// 命令行版本号
program
    .version(package.version);

// 命令行 开启解析服务
program
    .command('server [mode]')
    .option('-p, --port [port]','input your port')
    .description('server port')
    .action(function(mode,option){
        if(mode==='online'){
            // 开启静态解析服务
            require('./opt/static.js')(option.port||80,path.join(cwd,onlineDir));
        }else{
            // 开启动态解析服务
            require('./opt/server.js')(option.port||80,path.join(cwd,offlineDir));
        }
    });

// 初始化
program
    .command('init')
    .description('init project')
    .action(function(){
        // 生成目录结构
        require('./opt/init.js')(cwd);
    });

// 打包资源文件
program
    .command('build')
    .description('build online file')
    .action(function(){
        // 开始打包
        require('./opt/gulp.js')(cwd);
    });

program.parse(process.argv);
