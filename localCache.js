const iRemove = function(arr,val) { 
    var index = arr.indexOf(val); 
    if (index > -1) { 
        arr.splice(index, 1); 
    } 
}


//cache
global.pPlugins = global.pPlugins || {}
global.pPlugins.pathPluginMap = global.pPlugins.pathPluginMap || {}
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

const iNamePlguinsMapGet = moduleName =>{
    if(moduleName){
       var paths = global.pPlugins.namePlguinsMap[moduleName]
       if(paths){
           var arr = new Array()
           paths.forEach(element => {
               arr.push(iPathPluginMapGet(element))
           });
           return arr
       }
    }
    return null
}
const iNamePlguinsMapAdd = (moduleName,pluginPath)=>{
    if(moduleName && pluginPath){
        pluginPath = pluginPath.replace(/\//g,'_').replace(/\\/g,'_')
        if(!iPathPluginMapGet(pluginPath)){
            iPathPluginMapSet(pluginPath, require(pluginPath))
        }
        if(!global.pPlugins.namePlguinsMap[moduleName]){
            global.pPlugins.namePlguinsMap[moduleName] = new Array()
        }
        if( !global.pPlugins.namePlguinsMap[moduleName].contains(pluginPath)){
            global.pPlugins.namePlguinsMap[moduleName].push(pluginPath)
        }
    }
}

const iNamePlguinsMapRemove = (moduleName,pluginPath)=>{
    if(moduleName && pluginPath){
        if(pluginPath){
            if(global.pPlugins.namePlguinsMap[moduleName]){
                iRemove(global.pPlugins.namePlguinsMap[moduleName] , pluginPath)
            }
        }
        else{
            global.pPlugins.namePlguinsMap[moduleName] = null
        }
    }
}

//++++++++++++++++++++++++++++++++

exports.pathPluginMapGet =  iPathPluginMapGet 
exports.pathPluginMapSet  = iPathPluginMapSet
exports.namePlguinsMapGet = iNamePlguinsMapGet
exports.namePlguinsMapAdd = iNamePlguinsMapAdd
exports.namePlguinsMapRemove =iNamePlguinsMapRemove