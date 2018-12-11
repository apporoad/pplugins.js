
// 0. use as usual
var fs = require('fs')

// 1. first declare it is unimplement
require('../../index').unimplemented(module)

//2. declare your unImplement methods
exports.fn1 = ()=>{}

exports.fn1.input = ["abc"]

exports.fn1.output = "yes"

exports.fn2 = ()=>{}
//todo 

exports.fn2.inputs=[["abc"]]

exports.fn2.output = "yes"

exports.fn2.outputs = ["",1]