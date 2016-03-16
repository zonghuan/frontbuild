var express=require('express');
var app=express();

module.exports=function(port,rootPath){
    app.use(express.static(rootPath));
    app.listen(port,function(){
        console.log('start online mode , listen on '+port);
    });
};
