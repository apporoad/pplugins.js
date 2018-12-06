var util = require('./util')
var pathM = require('path')
var fs = require('fs')

const iRemove = function(arr,val) { 
    var index = util.ArrayIndexOf(arr,val,(one,two)=>{
        if(one.type == two.type)
        {
            return true
        }
        if(one.key == two.key){
            return true
        }
        return false
    })
    //arr.indexOf(val); 
    if (index > -1) { 
        arr.splice(index, 1); 
    } 
}


//cache
global.pPlugins = global.pPlugins || {}
/*
{
    "_test_pluglin.js_key" : {} // module.exports
}
*/
global.pPlugins.pathPluginMap = global.pPlugins.pathPluginMap || {}

/*
{
    "yourModule" : [
        {
            type: "pluginType",
            path: "_test_pluglin.js"
        }
    ]
}
*/
global.pPlugins.namePlguinsMap = global.pPlugins.namePlguinsMap || {}

const iPathPluginMapGet = path=>{
    if(path){
        var rp = path.replace(/\//g,'_').replace(/\\/g,'_')  + "_key"
        return global.pPlugins.pathPluginMap[rp]
    }
    return null
}
const iPathPluginMapSet = (path,value)=>{
    if(path){
        var rp = path.replace(/\//g,'_').replace(/\\/g,'_')  + "_key"
        global.pPlugins.pathPluginMap[rp] = value
    }
}

/*
returns 
[
    {} // module
]
*/
const iNamePlguinsMapGet = (moduleName,type) =>{
    moduleName = moduleName || "ppGlobal"
    if(moduleName){
       var paths = global.pPlugins.namePlguinsMap[moduleName]
       if(paths){
           var arr = new Array()
           paths.forEach(element => {
               var pw= iPathPluginMapGet(element.key)
               if(type && element.type == type){
                   return pw
               }
               arr.push(pw)
           });
           return arr
       }
    }
    return null
}

const iNamePlguinsMapAdd = (moduleName,pluginPath,type)=>{
    moduleName = moduleName || "ppGlobal"
    if( pluginPath){
        type = type || pathM.parse(pluginPath).name
        var key = pluginPath.replace(/\//g,'_').replace(/\\/g,'_')
        if(!iPathPluginMapGet(key)){
            if(!fs.existsSync(pluginPath)){
                console.error("pplugins:engine:iNamePlguinsMapAdd: plguginPath must exsits ： " + pluginPath)
                throw Error("pplugins:engine:iNamePlguinsMapAdd: plguginPath must exsits ： " + pluginPath)
            }
            iPathPluginMapSet(key, require(pluginPath))
        }
        if(!global.pPlugins.namePlguinsMap[moduleName]){
            global.pPlugins.namePlguinsMap[moduleName] = new Array()
        }
        if(!util.ArrayContains(global.pPlugins.namePlguinsMap[moduleName], {
            key : key, type : type, path :pluginPath
        },(one,two)=>{
            if(one.type == two.type){
                // here judge same type different path metion it
                if(one.key != two.key){
                    console.error("pplugins:iNamePlguinsMapAdd: module[" + moduleName+"]'s plugin's repeated, but they are different path : one :" + one.path + " two:" + two.path + " \r\n two unloaded")
                }
                return true
            }
            return false
        })){
            global.pPlugins.namePlguinsMap[moduleName].push({
                key : key, type : type, path :pluginPath
            })
        }
    }
}

const iNamePlguinsMapRemove = (moduleName,type, pluginPath)=>{
    moduleName = moduleName || "ppGlobal"
    if(pluginPath || type){
        if(global.pPlugins.namePlguinsMap[moduleName]){
            pluginPath  = pluginPath ? pluginPath.replace(/\//g,'_').replace(/\\/g,'_') : null
            iRemove(global.pPlugins.namePlguinsMap[moduleName] , { key : pluginPath,type : type})
        }
    }
    else{
        global.pPlugins.namePlguinsMap[moduleName] = []
    }

}

//++++++++++++++++++++++++++++++++

exports.pathPluginMapGet =  iPathPluginMapGet 
exports.pathPluginMapSet  = iPathPluginMapSet
exports.namePlguinsMapGet = iNamePlguinsMapGet
exports.namePlguinsMapAdd = iNamePlguinsMapAdd
exports.namePlguinsMapRemove =iNamePlguinsMapRemove