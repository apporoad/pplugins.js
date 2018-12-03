var pp = require('../index')


// here declare here will be plugined
pp.unimplemented(module)

require('./testUnImplement')


pp.unimplemented(module)
//console.log(module)
//console.log(pp)

//pp.unimplemented()

exports.hello  = null

console.log(JSON.stringify(exports))
