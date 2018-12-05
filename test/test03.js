var engine = require('../engine')


var abc = function(){} 
// abc = {}
// abc = new Object()

abc.fn = ()=>{}
abc.obj = new Object()
abc.arr = new Array()
abc.num = 1


engine.setProxy(abc)


abc.fn()
console.log(abc.obj)
console.log(abc.arr)
console.log(abc.num)
console.log(abc.aa)