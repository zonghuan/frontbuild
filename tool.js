var path=require('path');
var option=require('./option.json');
var cwd=process.cwd();

module.exports={
    getWidgetDir:function(){
        return path.join(cwd,option.widgetDir);
    }
};
