#!/usr/bin/env node
const path = require('path')
const program = require('commander')
const fs = require('fs')
const uicli = require('uicli.js')
const find = require('find')
const util = require('../util')

program.parse(process.argv)

// console.log(program.args)

var start =()=>{
    var initPath = program.args.length >0 ? program.args[0] : '.'
    initPath =path.resolve(process.cwd(),initPath)
    // console.log(initPath)
    // when a file :  d:/yourP.js
    return new Promise((r,j)=>{
        if(!fs.existsSync(initPath)){
            console.log("path not exists :" + initPath)
            j()
            return
        }
        if(fs.lstatSync(initPath).isFile()){
            r({
                moduleName : "???(string)[" + path.parse(initPath).name +"]pliz input module name",
                type : "???(string)[default]pliz input your plugin type",
                rpath : path.relative( process.cwd(),initPath),
                path : initPath
            })
        }
        else
        {
            // when is a dir  then find all js
            find.file(/\.js$/,initPath,files=>{
                if(files.length ==0){
                    j("your dir not exists .js file :" + initPath)
                    return
                }
               
                var rFiles =new Array()
                files.forEach(f =>{ rFiles.push(path.relative(initPath,f))})
                var moduleNameLust = {
                    moduleName : {
                        "isLust" : true,
                        "selectKeys" : files,
                        "selectValues" : rFiles,
                        "type" : "string",
                        "default" : files[0]
                    }
                }
                uicli.uiGetJson(moduleNameLust).then(mn =>{
                    r({
                        moduleName : "???(string)[" + path.parse(mn.moduleName).name +"]pliz input module name",
                        type : "???(string)[default]pliz input your plugin type",
                        rpath : path.relative( process.cwd(),mn.moduleName),
                        path : mn.moduleName
                    })
                })
            })
        }
    }).then(plust=>{
        // here to get some param ,need user's input
        return uicli.uiGetJson(plust)
    }).then(pluginJson=>{
        //console.log(pluginJson)
        //here to save to ./plugin.json
        SaveToPluginJSON(pluginJson)
    }).catch(reason=>{
        if(reason)
            console.log(reason)
    })
}

/*
{
    "yourModuleName" : [
        {
            "type" : "pluginType",
            "version": "1.0.0",
            "path" : "yourPlugin/p.js"
        }
    ]
}
*/
var SaveToPluginJSON = (pluginJson) =>{
    /*
    { moduleName: 'pp-howtouse',
  type: 'default',
  rpath: 'bin/pp-howtouse.js',
  path: '/home/rue/wp/pplugins.js/bin/pp-howtouse.js' }*/
   var pluginJsonPath = path.join(process.cwd(),'plugin.json')
    if(!fs.existsSync(pluginJsonPath)){
            var trueJson = {}
            trueJson[pluginJson.moduleName] = [{
                type : pluginJson.type,
                rpath : pluginJson.rpath,
                //path : pluginJson.path,
                version : '1.0.0'
            }]
            writeTruJson(pluginJsonPath,trueJson)
            return
    }
    // here to add
    var trueJson = require(pluginJsonPath)
    if(!trueJson[pluginJson.moduleName] || trueJson[pluginJson.moduleName].length == 0){
        trueJson[pluginJson.moduleName] = [{
            type : pluginJson.type,
            rpath : pluginJson.rpath,
            //path : pluginJson.path,
            version : '1.0.0'
        }]
        writeTruJson(pluginJsonPath,trueJson)
        return
    }
    var index = util.ArrayIndexOf(trueJson[pluginJson.moduleName] , pluginJson,(one,two)=>{
        if(one.type == two.type){
            return true
        }
        return false
    })
    if(index == -1){
        // insert 0 
        trueJson[pluginJson.moduleName].unshift({
            type : pluginJson.type,
            rpath : pluginJson.rpath,
            //path : pluginJson.path,
            version : '1.0.0'
        })
        writeTruJson(pluginJsonPath,trueJson)
        return
    }
    if(trueJson[pluginJson.moduleName][index].path == pluginJson.path){
        console.log('your js is already initialed ...')
        return
    }
    var minVersion = trueJson[pluginJson.moduleName][index].version
    var splitArray = minVersion.split('.')
    var last = parseInt(splitArray.pop()) + 1
    var suggestVersion = splitArray.join('.') + '.' + last
    var lustVersion={
        version: {
            isLust : true,
            remark : "pliz input new version, greater than " + minVersion,
            type : "s",
            default : suggestVersion,
            check : (lustInfo,data,type)=>{
                if(!/^\d+\.\d+\.\d+$/.test(data)){
                    console.log('your input should like x.x.x')
                    return {}
                }
                if(data<= minVersion){
                    console.log('your version must greater than ' + minVersion)
                    return {}
                }
                return {isPass : true ,isUpdate : true , message : "" }
            }

        }
    }
    uicli.uiGetJson(lustVersion).then(vInfo =>{
        trueJson[pluginJson.moduleName].unshift({
            type : pluginJson.type,
            rpath : pluginJson.rpath,
            //path : pluginJson.path,
            version : vInfo.version
        })
        writeTruJson(pluginJsonPath,trueJson)
    })
}

var writeTruJson = (apath,json) =>{
    //sort by version first
    for(key in json){
        var array = json[key]
        array.sort((a,b)=>{
            return a.version>b.version
        })
        json[key] = array
    }
    fs.writeFileSync(apath,JSON.stringify(json),'utf8')
    console.log("init success , " + apath )
    console.log('...')
}


start()