// 1. first declare it is unimplement
require('../index').unimplemented(module)

//2. declare your methods

exports.hello = ()=>{}

exports.hello.input = ["abc"]

exports.hello.inputs=[["abc"]]

exports.hello.output = "yes"

exports.hello.outputs = ["",1]