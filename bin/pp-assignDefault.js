#!/usr/bin/env node

const program = require('commander')
const cli = require('../cli')

program.parse(process.argv)

// console.log(program.args)

// .command('assignDefault [plguinName] [type] [version]','same as assign default [plguinName] [type] [version]')
// .command('assignDefault [plguinName] [type]','same as assign default [plguinName] [type]')
// .command('assignDefault [plguinName]','assign default [plguinName]')

var start =()=>{
    if(program.args.length < 1){
        cli.lsAssign()
        //console.log('try -h')
        return
    }
    var invokerName = 'default'
    var plguinName = program.args[0]
    if(!plguinName){
        console.log('plguinName cant be emplty!!!')
        return
    }
    var type = program.args.length>1 ? (program.args[1] || 'default') : null
    var version = program.args.length>2 ? (program.args[2] || 'default') : null
    if(version){
        if(!/^\d+\.\d+\.\d+$/.test(version)){
            console.log('version should like x.x.x')
            return
        }
    }
    cli.assign(invokerName,plguinName,type,version)
    console.log('mission complete')
}

start()