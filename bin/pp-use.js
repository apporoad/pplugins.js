#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const fs = require('fs')
const uicli = require('uicli.js')
const find = require('find')
const util = require('../util')

program.parse(process.argv)


var start =()=>{
    var usePath = program.args.length >0 ? program.args[0] : '.'
    usePath =path.resolve(process.cwd(),usePath)

    
}


start()