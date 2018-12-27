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
    var pluginJson = cli.getPlguinJson(initPath)
    var uiLustJson = {
        moduleName : "???",
        type : "default",
        version : "1.0.0",
        rpath : "xxxxxx",
        apath :"xxxx"
    }

    return new Promise((r,j)=>{
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
                //todo
            })
        }
    })
    

    uicli.uiGetJson()
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