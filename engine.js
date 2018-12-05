const ioc = require('peeriocjs')
const util = require('./util')


exports.run =()=>{}


var icheckInject = inputModule =>{
    //todo
}
/**
 *  inject your module with unreged methods
 */
exports.inject=(inputModule,pluginName) =>{
    icheckInject(inputModule)
    if(!pluginName){
        //todo read config
    }
    //console.log(inputModule)
    for(var mt in inputModule){
        var element = inputModule[mt]
        if(util.Type.isFunction(element)){
            //console.log(element)
            //todo
            inputModule[mt] = function(){console.log('hello good day')}

        }
    }
}

exports.autoInject = ()=>{}


/*
proxy maybe:
    "/abc/acb/test.js"
    {}
    null
*/
exports.getProxy = (anything)=>{
    //todo check
    if(util.Type.isString(anything)){
        return require(anything)
    }
    if(util.Type.isObject(anything) || util.Type.isFunction(anything)){
        return anything
    }
    return null
}

/*
proxy maybe:
    {}
    null
*/
exports.getProxyFunctionHandler = (proxy, originInfo) =>{
    //todo inputs outputs ....
    if(!proxy){
        return (key,params) =>{
            //todo
            return ioc.module("xxxx").invoke(key)[key](params)
        }
    }
    return (key,params)=>{
        //todo need edit
        return proxy[key](params)
    }
}

// returns promise
/*
proxy maybe:
    "/abc/acb/test.js"
    {}
    null

originInfo can be:
{
    name : "moduleName",
    pluginName : "????"
}

*/
exports.setProxy =(origin, proxy ,originInfo) =>{
    var json = origin
    var porxyHandler = exports.getProxyFunctionHandler(exports.getProxy(proxy),originInfo)
    if(util.Type.isObject(json) || util.Type.isFunction(json)){
        for(var key in json){
            var val = json[key]
            if(util.Type.isFunction(val)){
                //set function proxy
                json[key] = (...params)=>{ 
                    return porxyHandler(key,params)
                    //console.log('here proxy method :' + key)
                }
            } else{
                json[key] = "proxy val :" + val
                // todo get set 
            }
        }
    }
    else{
        console.error("ppulgins:engine: only Object or Function can setProxy :" + json)
    }
}
