#!/usr/bin/env node

var commander = require('commander')


commander.version('v' + require('../package.json').version)
.usage('[options] {command} ...')
.command('howtouse', 'show how to use', { isDefault: true })
.command('init [path]','init a plugin.json @ [path] ')
.command('init','just like ( init . )')

.command('use [path]' , 'use plugin, publish plugin to your system global,pp will scan all the children dirs ')
.command('use' ,'just like ( use . )')
.command('unuse [path]' , 'unuse plguin')
.command('unuse' , 'just like ( unuse .)')
.command('publish [path]','just like use')
.command('publish','just like ( use . )')
.command('ls' , 'list all plugins')
.command('ll' , 'more detals for ls')
.command('refresh','fresh all plugins,check plugins, if invalid ,remove it')
.command('clear' , 'clear useing plugins , be careful to use')

.command('assign [invokerName] [plguinName] [type] [version]','assign invoker assigned plguin')
.command('assign [invokerName] [plguinName] [type]','assign invoker assigned plguin, version use last version')
.command('assign [invokerName] [plguinName]','assign invoker assigned plguin, version use last version , use first type')

.command('assignDefault [plguinName] [type] [version]','same as assign default [plguinName] [type] [version]')
.command('assignDefault [plguinName] [type]','same as assign default [plguinName] [type]')
.command('assignDefault [plguinName]','assign default [plguinName]')

.option('--verbose', 'output verbose messages on internal operations')
.parse(process.argv)