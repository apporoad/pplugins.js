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

    // find files which named plugin.json
    find.file(/plugin\.json$/,usePath,files=>{
        if(!files || files.length==0){
            console.log('cant find init file : plugin.json')
            return
        }
        var pplguinAllJson = cli.getPpluginsAll()
        files.forEach(file=>{
            if(!pplguinAllJson[file]){
                pplguinAllJson[file] =new Date()
                console.log('find and join ppgluins :' + file)
            }else{
                //nothing to do
            }
        })
        cli.setPpluginsAll(pplguinAllJson)
        console.log('mission completed')
    })
    
}


start()