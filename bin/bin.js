#!/usr/bin/env node

var commander = require('commander')


commander.version('v' + require('../package.json').version)
.usage('[options] {command} ...')
.command('howtouse', 'show how to use', { isDefault: true })
.command('init [path]','init a plugin.json @ [path] ')
.command('init','just like ( init . )')

.command('use [path]' , 'use plugin, publish plugin to your system global,pp will scan all the children dirs ')
.command('use' ,'just like ( use . )')
.command('publish [path]','just like use')
.command('publish','just like ( use . )')
.command('ls' , 'list all plugins')
.command('refresh','fresh all plugins,check plugins, if invalid ,remove it')
.command('clear' , 'clear useing plugins , be careful to use')
.option('--verbose', 'output verbose messages on internal operations')
.parse(process.argv)