const ioc = require('peeriocjs')
const util = require('./util')

const fs = require('fs')
const path = require('path')
const lc = require('./localCache')
const config = require('./config.json')
const caller = require('caller.js')
const cli = require('./cli')

// a queue stores what need to load plugins
/*
[
    {
        key : xxxxxxxxxxxxxxxxxxxxx,
        origin:{
            test : {},
            abc : function(){}
        },
        moduleName:"",
        type : ""
    }
]
*/
var injectRequestQueue = new Array()

exports.run =()=>{}

var iGenerateInjectRequestKey = request=>{
    if(request.moduleName && request.type){
        return request.moduleName + "___" + request.type
    }
    //todo key = origin.keys  + modulename + type
    return "abc"
}

var iJudgeDir = dir=>{
    var packageJson = path.join(dir,"package.json")
    var node_modules = path.join(dir, "node_modules")
    if(fs.existsSync(packageJson) || fs.existsSync(node_modules)){
        return true
    }
    return false
}
//recurse find a dir with node_modules or package.json as topScanPath
var igetTopScanPath = dir=>{
    var dirs = new Array()

    var currentDir = dir
    while(true){
        if(iJudgeDir(currentDir)){
            dirs.push(currentDir)
        }
        if(currentDir == path.dirname(currentDir)){
            break
        }
        currentDir = path.dirname(currentDir)
        //console.log(currentDir)
    }
    //console.log(dirs.pop())
    return dirs.length >0 ? dirs.pop() : null
}

var iPpJsonJoin = (ppjson1 ,ppjson2)=>{
    /*{
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
    for(var key in ppjson2){
        if(ppjson1[key]){
            ppjson2[key].forEach(element => {
                if(!util.ArrayContains(ppjson1[key],element,(one,two)=>{
                    return one.type == two.type && one.version == two.version
                })){
                    ppjson1[key].push(element)
                }
            });
        }else{
            ppjson1[key] =ppjson2[key]
        }
    }
    // resort
    for(key in ppjson1){
        var array = ppjson1[key]
        array.sort((a,b)=>{
            return a.version>b.version
        })
        ppjson1[key] = array
    }
    return ppjson1
}

// auto to find plguins and load to cache
var iAutoInject = ()=>{
    // here to load local
    var packageRootPath = igetTopScanPath(caller.getTopCallerDir())
    /*{
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
    var localPPJson = {}
    if(packageRootPath){
        localPPJson =  cli.getPpluginsJsonFromDir(packageRootPath)
    }
    // here to load global
    var globalPPJson = cli.getGlobalPpluginsJson()
    //join togather
    var totalPPJson = iPpJsonJoin(localPPJson,globalPPJson)
    // get assign
    /*{
    "module" : "moduleName",
    "type" : {
            "moduleName" : "type"
    },
    "version" : {
            "moduleName" : {
                "type" :"xxxx"
    } 
}*/
    var assign = cli.getAssign(global.pluginInvokerName || 'default')
    // todos
    //lc.namePlguinsMapAdd
    // find assign and set default
    if(assign.module){
        if(totalPPJson[assign.module]){
            lc.namePlguinsMapAdd('default',totalPPJson[assign.module][0].path,'default')
        }
    }
    if(assign.type){
        for(mn in assign.type){
            if(totalPPJson[mn]){
                var index = util.ArrayIndexOf(totalPPJson[mn],assign.type[mn],(one,two)=>{
                    return one == two.type
                })
                if(index>-1)
                    lc.namePlguinsMapAdd(mn,totalPPJson[mn][index].path,'default')
            }
        }
    }
    if(assign.version){
        for(mn in assign.version){
            for(ttype in assign.version[mn]){
                var index =  util.ArrayIndexOf(totalPPJson[mn],{ type : ttype,version : assign.type[mn][ttype]},(one,two)=>{
                    return one.type == two.type && one.version == two.version
                })
                if(index > -1)
                    lc.namePlguinsMapAdd(mn,totalPPJson[mn][index].path,ttype)
            }
        }
    }

}



// here auto execute injectRequestQueue
var iAutoMatchRequest =()=>{
    while(injectRequestQueue.length>0){
       var injectRequest = injectRequestQueue.pop()
       var key = iGenerateInjectRequestKey({
            origin : injectRequest.origin,
            moduleName :injectRequest.moduleName,
            type : injectRequest.type
        })
        var plguin = exports.getPlugin(injectRequest.moduleName,injectRequest.type)
        var invokeModule = ioc.module(key + "_pplugins")
        
        for(var k in injectRequest.origin){
            // here to reg 
            invokeModule.reg(k,plguin[k])
        }
    }
    // //here cycle 
    // setTimeout(iAutoMatchRequest, config.internal || 500);
}

exports.getPlugin =(moduleName="", pluginType="")=>{
    //from cache
    if(lc.namePlguinsMapGet(moduleName,pluginType)){
        var arr =lc.namePlguinsMapGet(moduleName,pluginType)
        if(arr.length==1)
            return arr[0]
        if(arr.length>1){
            console.log("pplugin: getPlugin: find one more plugin ， return first one")
            return arr[0]
        }
    }
    throw Error("cant find your plugin:" + moduleName + " " + pluginType )
}


exports.getProxyPlugin = (origin,moduleName="", pluginType="")=>{
    var proxy = {}
    var key = iGenerateInjectRequestKey({
        origin : origin,
        moduleName :moduleName,
        type : pluginType
    })
    var invokeModule = ioc.module(key + "_pplugins")

    // // todo check origin
    // for(var k in origin){
    //     invokeModule.record([k])
    //     //here function and others are same
    //     proxy[k] = invokeModule.invoke(k).sync[k]
    // }
    
    //add    injectRequestQueue
    injectRequestQueue.push({
        key: key,
        origin : origin,
        moduleName : moduleName,
        type: pluginType
    }) 
    iAutoMatchRequest()
    proxy = invokeModule.invoke.sync
    return proxy
}




exports.checkProxy = (origin,proxy,verbose) =>{
    //todo
}

exports.setProxy =(origin, proxy ,completeFn) =>{
    //
    if(origin.iproxy){
        console.log("accc")
        origin.iproxy = proxy
        return
    }
    //override proxy
    origin.iproxy = proxy
    //check proxy match origin
    exports.checkProxy(origin,proxy,true)
    if(util.Type.isObject(origin) || util.Type.isFunction(origin)){
        // console.log('aaaaaaaaaaaa')
        for(var key in origin){
            //ignore iproxy
            if(key == "iproxy")
            {
                continue
            }
            var val = origin[key]
            if(util.Type.isFunction(val)){
                //console.log("aaaaaaaaaaaaaaaaaa:" +key)
                //set function proxy
                //closure
                var generate = ()=>{
                    var keepKey = key
                    return  ((...params)=>{ 
                        //console.log("CCCCCCCCCCCCCC:" + keepKey)
                        //if has proxy
                        if(origin.iproxy){
                            if(!origin.iproxy[keepKey]){
                                console.error("proxy: your proxy method undefined :" + keepKey )
                                throw new Error("proxy: your proxy method undefined :" + keepKey )
                            }
                            if(!util.Type.isFunction(origin.iproxy[keepKey])){
                                //console.trace()
                                console.error("proxy: your proxy."+ keepKey+" must be a function ")
                                throw new Error("proxy: your proxy."+ keepKey + " must be a function ")
                            }
                            return origin.iproxy[keepKey].apply(origin.iproxy,arguments)
                        }else{
                            //console.log(origin)
                            console.error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                            throw new Error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                        }
                        //console.log('here proxy method :' + key)
                    })
                }

                origin[key] = generate()
            } else{
                //console.log("bbbbbbbbbbbbbbb:" + key)
                // ison[key] = "proxy val :" + val
            
                //closure
                var gGet = ()=>{
                    var keepKey = key
                    return  function() {
                        if(origin.iproxy){
                            if(util.Type.isFunction(origin.iproxy[keepKey])){
                                return origin.iproxy[keepKey]()
                            }
                            return origin.iproxy[keepKey]
                        }
                        console.error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                        throw new Error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                    }
                }
                var gSet = ()=>{
                    var keepKey = key
                    return function(value) {
                        if(origini.iproxy){
                            if(util.Type.isFunction(origin.iproxy[keepKey])){
                                origin.iproxy[keepKey](value)
                            }else{
                                origin.iproxy[keepKey] = value
                            }
                            
                        }
                        console.error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                        throw new Error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                    }
                }

                // todo get set 
                Object.defineProperty(origin, key, {
                    get: gGet(),
                    set: gSet()
                })
            }
        }
    }
    else{
        console.error("ppulgins:engine: only Object or Function can setProxy :" + origin)
    }

    if(completeFn){
        completeFn(origin,proxy)
    }
    //console.log(origin)
    //console.log(origin.iproxy)
}



exports.init =function(){
    if(!global.ppluginInitStarted){
        global.ppluginInitStarted =true
        iAutoInject()
    }
}

