#!/usr/bin/env node
const path = require('path')
const program = require('commander')
const fs = require('fs')
const cli = require('../cli')
const uicli = require('uicli.js')
const find = require('find')

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
        return uicli.uiGetJson(plust)
    }).then(pluginJson=>{
        console.log(pluginJson)
    }).catch(reason=>{
        if(reason)
            console.log(reason)
    })
    

    //uicli.uiGetJson()
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

}


start()