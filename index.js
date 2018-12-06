var engine = require('./engine')
var caller = require('caller.js')


var unimplemented = (invokeModule,moduleName="",pluginType="")=>{ 
    // rewrite module.parent
    //console.log(module.parent)
    if(!invokeModule){
        throw Error("pplugins:index: your must input a module")
    }
    //console.log(path)

    //console.log(invokeModule)
    //wait module loaded ,then ...
    Object.defineProperty(invokeModule, 'loaded', {
        get: function() {
            return loaded;
        },
        set: function(value) {
            if(value){
                //console.log(invokeModule.id + ' loaded: ' + value);
                //here load complete //and set proxy
                //console.log(invokeModule.exports)
                engine.setProxy(invokeModule.exports,engine.getProxyPlugin(moduleName,pluginType))
            }
        }
    })
}

exports.unimplemented = unimplemented 



exports.implement = moduleName => {}



