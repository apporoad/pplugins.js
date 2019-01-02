#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const fs = require('fs')
const uicli = require('uicli.js')
const find = require('find')
const util = require('../util')
const cli = require('../cli')

program.parse(process.argv)


var start =()=>{
    var usePath = program.args.length >0 ? program.args[0] : '.'
    usePath =path.resolve(process.cwd(),usePath)
    //console
    // find files which named plugin.json
    //console.log(usePath)
    find.file(/plugin\.json$/,usePath,files=>{
        //console.log(files)
        if(!files || files.length==0){
            console.log('cant find init file : plugin.json')
            return
        }
        var pplguinAllJson = cli.getPpluginsAll()
        files.forEach(file=>{
            if(pplguinAllJson[file]){
                delete pplguinAllJson[file]
                console.log('find and remove from ppgluins :' + file)
            }else{
            }
        })
        cli.setPpluginsAll(pplguinAllJson)
        console.log('mission completed')
    })
}


start()