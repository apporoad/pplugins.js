#!/usr/bin/env node

const program = require('commander')
const cli = require('../cli')

program.parse(process.argv)

// console.log(program.args)

// .command('assign [invokerName] [plguinName] [type] [version]','assign invoker assigned plguin')
// .command('assign [invokerName] [plguinName] [type]','assign invoker assigned plguin, version use last version')
// .command('assign [invokerName] [plguinName]','assign invoker assigned plguin, version use last version , use first type')

var start =()=>{
    if(program.args.length < 2){
        console.log('try -h')
        return
    }
    var invokerName =  program.args[0] || 'default'
    var plguinName = program.args[1]
    if(!plguinName){
        console.log('plguinName cant be emplty!!!')
        return
    }
    var type = program.args.length>2 ? (program.args[2] || 'default') : 'default'
    var version = program.args.length>3 ? (program.args[3] || 'default') : 'default'
    if(version != 'default'){
        if(!/^\d+\.\d+\.\d+$/.test(version)){
            console.log('version should like x.x.x')
            return
        }
    }
    cli.assign(invokerName,plguinName,type,version)
    console.log('mission complete')
}

start()