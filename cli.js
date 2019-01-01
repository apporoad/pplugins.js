const fs = require('fs')
const path = require('path')
const os = require('os')
const util = require('./util')

const ppluginsDir = path.join(os.tmpdir() ,"pplugins")
if(!fs.existsSync(ppluginsDir))
    fs.mkdirSync(ppluginsDir)
const ppluginsAllPath = path.join(ppluginsDir,'pplugins.all')
const ppluginsJsonPath = path.join(ppluginsDir , 'pplugins.json')
const assignListPath = path.json(ppluginsDir,'assignList.json')


/**
 * here get plugin json from a path
 */
exports.getPlguinJson = fPath=>{
    var dir = fs.lstatSync(fPath).isFile() ? path.dirname(fPath) : fPath
    var pluginJsonPath = path.join(dir, 'plugin.json')
    if(fs.existsSync(pluginJsonPath)){
        return require(pluginJsonPath)
    }
    return {}
}


//pplugins.all
/*
{
    "path" : "plugin.json's path"
}
*/
exports.getPpluginsAll= ()=>{
    if(fs.existsSync(ppluginsAllPath)){
        return require(ppluginsAllPath)
    }
    return {}
}

exports.setPpluginsAll= json=>{
    fs.writeFileSync(ppluginsAllPath,JSON.stringify(json),'utf-8')
    // recache pplugins.json
    exports.reCachePpluginsJson(json)
}

var innerJionPpluginsJson = (ppsJson,pjsonPath) =>{
    pjson  = require(pjsonPath)
    for(var mn  in pjson){
        if(!ppsJson[mn]){
            ppsJson[mn] = []
            pjson[mn].forEach(element => {
                ppsJson[mn].push({
                    type : element.type,
                    version : element.version,
                    path :element.path,
                    rpath : element.rpath,
                    pluginJsonPath : pjsonPath,
                    updateDate : new Date()
                })
            })
        }else{
            pjson[mn].forEach(element=>{
                var index = util.ArrayIndexOf(ppsJson[mn],element,(one,two)=>{
                    if(one.type == two.type && one.version == two.version){
                        return true
                    }
                    return false
                })
                if(index > -1){
                    if(element.path != ppsJson[mn][index].path){
                        console.log('conflict in [' + mn + "] [" + element.type + "] [" + element.version + "] :" + element.path + " use " +  ppsJson[mn][index].path )
                        console.log('pliz edit configFile : ' + pjsonPath)
                    }
                    return
                }
                ppsJson[mn].push({
                    type : element.type,
                    version : element.version,
                    path :element.path,
                    rpath : element.rpath,
                    pluginJsonPath : pjsonPath,
                    updateDate : new Date()
                })
            })
        }
    }
}

/*
{
    "yourModuleName" : [
        {
            "type" : "pluginType",
            "version": "1.0.0",
            "path" : "d:/yourPlugin/p.js",
            "pluginJsonPath" : "d:/yourPlguin/plugin.json" ,
            "updateDate" : "xxxxx"
        }
    ]
}*/
exports.reCachePpluginsJson = (ppluginAllJson) =>{
    if(!ppluginAllJson){
        var ppluginAllJson = require(ppluginsAllPath)
    }
    if(fs.existsSync(ppluginsJsonPath)){
        fs.unlinkSync(ppluginsJsonPath)
    }
    var ppsJson = {}
    for(var p in ppluginAllJson){
        if(fs.existsSync(p)){
            /*{
                "yourModuleName" : [
                    {
                        "type" : "pluginType",
                        "version": "1.0.0",
                        "path" : "yourPlugin/p.js"
                        "rpath" : "rpath"
                    }
                ]
            }*/
            innerJionPpluginsJson(ppsJson,p)
        }
    }
    // re sort 
    for(key in ppsJson){
        var array = json[key]
        array.sort((a,b)=>{
            return a.version>b.version
        })
        ppsJson[key] = array
    }
    fs.writeFileSync(ppluginsJsonPath,JSON.stringify(ppsJson),'utf8')
}


exports.ls = isDetail=>{
    if(fs.existsSync(ppluginsJsonPath)){
        var pps = require(ppluginsJsonPath)
        for(var mn in pps){
            pps[mn].forEach(e => {
                if(isDetail)
                    console.log("[${mn}] [${e.type}] [${e.version}] : [${e.path}] : from [${e.pluginJsonPath}]" )
                else
                    console.log("[${mn}] [${e.type}] [${e.version}]")
            });
            
        }
    }else{
        console.log('pliz use first')
    }
}

exports.clear = ()=>{
    if(fs.existsSync(ppluginsAllPath))
        fs.unlinkSync(ppluginsAllPath)
    if(fs.existsSync(ppluginsJsonPath))
        fs.unlinkSync(ppluginsJsonPath)
    if(fs.existsSync(assignListPath))
        fs.unlinkSync(assignListPath)
}


exports.assign = (invoker,moduleName,type,version)=>{

}