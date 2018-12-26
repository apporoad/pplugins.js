var engine = require('./engine')
var caller =require('caller.js')
var util = require('./util')

var unimplemented = (invokeModule,moduleName="",pluginType="")=>{ 
    // init first
    engine.init()

    moduleName = moduleName || 'default'
    pluginType = pluginType || 'default'
    // rewrite module.parent
    //console.log(module.parent)
    if(!invokeModule){
        throw Error("pplugins:index: your must input a module")
    }
    //console.log(path)
    //console.log("call dir :" +caller.getDir())

    //console.log(invokeModule)
    //wait module loaded ,then ...
    Object.defineProperty(invokeModule, 'loaded', {
        get: function() {
            return loaded;
        },
        set: function(value) {
            if(value){
                //console.log(invokeModule.id + ' loaded: ' + value);
                //here load complete //and set proxy
                //console.log(invokeModule.exports)
                engine.setProxy(invokeModule.exports,engine.getProxyPlugin(moduleName,pluginType))
            }
        }
    })
}

exports.unimplemented = unimplemented 



exports.implement = moduleName => {}


exports.invoker = invokerName =>{
    global.pluginInvokerName = invokerName
}

/**
 * 
{
    invoker : "your program instance's name",
    pRootPath : "your plugin root Path, default is the method (use) is invoked ,only absolutely path",

}
 */
exports.use = options =>{

}

/**
 for dynamic plguin situation
 */
exports.getDynamicProxy = (yourModuleOrModulePath,moduleName="",pluginType="" )=>{
    if(!yourModuleOrModulePath)
        yourModuleOrModulePath = caller.getCaller().fileName
    moduleName = moduleName || 'default'
    pluginType = pluginType || 'default'

    if(util.Type.isString(yourModuleOrModulePath)){
        //todo
    }
    //todo
}
