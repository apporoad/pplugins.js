const fs = require('fs')
const path = require('path')
const os = require('os')
const util = require('./util')
const find = require('find')

const ppluginsDir = path.join(os.tmpdir() ,"pplugins")
if(!fs.existsSync(ppluginsDir))
    fs.mkdirSync(ppluginsDir)
const ppluginsAllPath = path.join(ppluginsDir,'pplugins.all')
const ppluginsJsonPath = path.join(ppluginsDir , 'pplugins.json')
const assignListPath = path.join(ppluginsDir,'assignList.json')



exports.getGlobalPpluginsJson = ()=>{
    if(fs.existsSync(ppluginsJsonPath)){
        return require(ppluginsJsonPath)
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
    //console.log(pjsonPath)
    var pjsonDir = path.dirname(pjsonPath)
    pjson  = require(pjsonPath)
    for(var mn  in pjson){
        if(!ppsJson[mn]){
            ppsJson[mn] = []
            pjson[mn].forEach(element => {
                ppsJson[mn].push({
                    type : element.type,
                    version : element.version,
                    path :element.path || path.join(pjsonDir,element.rpath),
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
                    path :element.path  || path.join(pjsonDir,element.rpath),
                    rpath : element.rpath,
                    pluginJsonPath : pjsonPath,
                    updateDate : new Date()
                })
            })
        }
    }
}

var iGetPpluginsJsonFromPaths = ppluginAllJson =>{
    var ppsJson = {}
    //console.log(ppluginAllJson)
    for(var p in ppluginAllJson){
        if(fs.existsSync(p)){
            /*{
                "yourModuleName" : [
                    {
                        "type" : "pluginType",
                        "version": "1.0.0",
                        //"path" : "yourPlugin/p.js"
                        "rpath" : "rpath"
                    }
                ]
            }*/
            innerJionPpluginsJson(ppsJson,p)
        }
    }
    // re sort 
    for(key in ppsJson){
        var array = ppsJson[key]
        array.sort((a,b)=>{
            return a.version>b.version
        })
        ppsJson[key] = array
    }
    //console.log(ppsJson)
    return ppsJson
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
    var ppsJson =iGetPpluginsJsonFromPaths(ppluginAllJson)
    fs.writeFileSync(ppluginsJsonPath,JSON.stringify(ppsJson),'utf8')
}



exports.ls = isDetail=>{
    if(fs.existsSync(ppluginsJsonPath)){
        var pps = require(ppluginsJsonPath)
        for(var mn in pps){
            pps[mn].forEach(e => {
                if(isDetail)
                    console.log(`[${mn}] [${e.type}] [${e.version}] : [${e.path}] : from [${e.pluginJsonPath}]` )
                else
                    console.log(`[${mn}] [${e.type}] [${e.version}]`)
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

/*
{
    "module" : {
        "invoker" : "moduleName"
    },
    "type" : {
        "invoker": {
            "moduleName" : "type"
        }
    },
    "version" : {
        "invoker" : {
            "moduleName" : {
                "type" :"xxxx"
            } 
        }
    }
}
*/
exports.assign = (invoker,moduleName,type,version)=>{
    invoker = invoker || "default"
    // type = type || "default"
    // version = version || "default"
    var aJson = {}
    if(fs.existsSync(assignListPath)){
        aJson = JSON.parse(fs.readFileSync(assignListPath,'utf8'))
    }

    if(!type && !version){
        aJson["module"] = aJson["module"] || {}
        aJson["module"][invoker] = moduleName
    }else if( !version){
        aJson["type"] = aJson["type"] || {}
        aJson["type"][invoker] = aJson["type"][invoker] || {}
        aJson["type"][invoker][moduleName] = type
    }else{
        aJson["version"] = aJson["version"] || {}
        aJson["version"][invoker] = aJson["version"][invoker] || {}
        aJson["version"][invoker][moduleName] = aJson["version"][invoker][moduleName] || {}
        aJson["version"][invoker][moduleName][type] = version
    }
    fs.writeFileSync(assignListPath,JSON.stringify(aJson),'utf8')
}

exports.lsAssign = ()=>{
    if(fs.existsSync(assignListPath)){
        aJson = JSON.parse(fs.readFileSync(assignListPath,'utf8'))
        if(aJson.module){
            for(ik in aJson.module){
                console.log(`invoker:[${ik}]  moduleName:[${aJson.module[ik]}]`)
            }
        }
        if(aJson.type){
            for(ik in aJson.type){
                for(mn in aJson.type[ik]){
                    console.log(`invoker:[${ik}]  moduleName:[${mn}] type:[${aJson.type[ik][mn]}]`)
                }
            }
        }
        if(aJson.version){
            for(ik in aJson.version){
                for(mn in aJson.version[ik]){
                    for(ty in aJson.version[ik][mn]){
                        console.log(`invoker:[${ik}]  moduleName:[${mn}] type:[${ty}] version:[${aJson[ik][mn][ty]}]`)
                    }
                }
            }
        }
    }
}


/*
{
    "module" : "moduleName",
    "type" : {
            "moduleName" : "type"
    },
    "version" : {
            "moduleName" : {
                "type" :"xxxx"
    } 
}
*/
exports.getAssign =invoker =>{
    if(invoker){
        if(fs.existsSync(assignListPath)){
            aJson = JSON.parse(fs.readFileSync(assignListPath,'utf8'))
            var module1 = aJson.module ?  aJson.module[invoker] : null
            var type = aJson.type ? aJson.type[invoker] : null
            var version = aJson.version ? aJson.version[invoker] : null
            return {
                module : module1,
                type : type,
                version : version
            }
        }
    }
    return {}
}


/**
 * get ppJson from dir
 */
exports.getPpluginsJsonFromDir= dir=>{
    var files  = find.fileSync(/plugin\.json$/,dir)
    //console.log(files)
    var pplguinAllJson = {}
    files.forEach(file=>{
        file = path.resolve(dir , file)
        //console.log(file)
        if(!pplguinAllJson[file]){
            pplguinAllJson[file] =new Date()
        }
    })
    return iGetPpluginsJsonFromPaths(pplguinAllJson)
}