var lc =require('../localCache')

lc.pathPluginMapSet("d:\\a/c/abc.js","abc")

lc.pathPluginMapSet("d:\\a/c/abcd.js","abcd")

console.log(lc.pathPluginMapGet("d:/a/c/abc.js"))

console.log(lc.pathPluginMapGet("d:\\a/c\\abcd.js"))

console.log(global.pPlugins.pathPluginMap)


console.log("++++++++++++++++++++++++++++++++++++++++++++++++")

lc.namePlguinsMapAdd("test",__dirname + "/others/test04.js")

lc.namePlguinsMapAdd("test2" , __dirname + "/others/test04.js")

lc.namePlguinsMapAdd("test" , __dirname + "/others/test041.js","test041")

lc.namePlguinsMapAdd(null,__dirname + "/others/test04.js")


console.log(lc.namePlguinsMapGet("test"))

console.log(lc.namePlguinsMapGet("test","test041"))

console.log(global.pPlugins.namePlguinsMap)

console.log(global.pPlugins.pathPluginMap)


console.log("------------------------------------------------")

lc.namePlguinsMapRemove()
lc.namePlguinsMapRemove("test2","test04")

console.log(global.pPlugins.namePlguinsMap)

console.log(global.pPlugins.pathPluginMap)
