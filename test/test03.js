var engine = require('../engine')


var abc =function(){} 
// abc = {}
// abc = new Object()

abc.fn = ()=>{}
abc.obj = new Object()
abc.arr = new Array()
abc.num = 1

var proxy = {}
proxy.fn = ()=>{ console.log("hello good day")}
proxy.obj = {abc : "hello"}
proxy.arr = [1,2,3]
proxy.num = 100


engine.setProxy(abc,proxy)

abc.fn()
console.log(abc.obj)
console.log(abc.arr)
console.log(abc.num)
console.log(abc.aa)

console.log("here to remove iproxy ===========================================")
abc.iproxy =null
//abc.fn()
// console.log(abc.obj)
// console.log(abc.arr)
// console.log(abc.num)
// console.log(abc.aa)
console.log("here to replace iproxy ===========================================")
var proxy2 = {}
proxy2.fn = ()=>{ console.log("hello LiSA")}
proxy2.obj = {abc : "hello world"}
proxy2.arr = [1,2,3,4,5,6]
proxy2.num = 100

engine.setProxy(abc,proxy2)
//abc.iproxy = proxy2

abc.fn()
console.log(abc.obj)
console.log(abc.arr)
console.log(abc.num)
console.log(abc.aa)

console.log("here to super iproxy ===========================================")

proxy2.obj = value=>{ return "haha"}

console.log(abc.obj)
