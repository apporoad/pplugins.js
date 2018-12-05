var engine = require('./engine')
var caller = require('caller.js')

const iSetProxy= invokeModule =>{

}

var unimplemented = invokeModule=>{ 
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
                iSetProxy(invokeModule)
            }
        }
    })
}

exports.unimplemented = unimplemented 



exports.implement =() => {}

