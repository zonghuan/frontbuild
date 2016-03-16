#!/usr/bin/env node

var program=require('commander');
var path=require('path');
var cwd=process.cwd();
var package=require('./package.json');

var option=require('./option.json');

var offlineDir=option.offlineDir;
var onlineDir=option.onlineDir;
var jsDir=option.jsDir;
var cssDir=option.cssDir;

program
    .version(package.version);

program
    .command('server [mode]')
    .option('-p, --port [port]','input your port')
    .description('server port')
    .action(function(mode,option){
        if(mode!=='online'&&mode!=='offline'){
            mode='offline';
        }
        if(mode==='online'){
            require('./opt/static.js')(option.port||80,path.join(cwd,onlineDir));
        }else{
            require('./opt/server.js')(option.port||80,path.join(cwd,offlineDir));
        }

    });

program
    .command('init')
    .description('init project')
    .action(function(){
        require('./opt/init.js')(cwd);
    });

program
    .command('build')
    .description('build online file')
    .action(function(){
        require('./opt/gulp.js')(cwd);
    });

program.parse(process.argv);
