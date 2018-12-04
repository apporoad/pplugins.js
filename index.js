


var unimplemented = invokeModule=>{ 
    // rewrite module.parent
    //console.log(module.parent)
    if(!invokeModule){
        throw Error("pplugins:index: your must input a module")
    }

    //console.log(invokeModule)
    //wait module loaded ,then ...
    Object.defineProperty(invokeModule, 'loaded', {
        get: function() {
            return loaded;
        },
        set: function(value) {
            if(value){
                //console.log(invokeModule.id + ' loaded: ' + value);
                //here load complete
            }
        }
    })
}

exports.unimplemented = unimplemented 



exports.implement =() => {}

