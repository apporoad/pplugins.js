#!/usr/bin/env node
const path = require('path')
const program = require('commander')
const fs = require('fs')

program.parse(process.argv)

// console.log(program.args)

var pre =()=>{
    var initPath = program.args.length >0 ? program.args[0] : '.'
    initPath =path.resolve(process.cwd(),initPath)
    // console.log(initPath)
    // when a file :  d:/yourP.js
    
    // when is a dir  then find all js
}


pre()