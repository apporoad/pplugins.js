


var unimplemented = invokeModule=>{ 
    // rewrite module.parent
    //console.log(module.parent)
    if(!invokeModule){
        throw Error("pplugins:index: your must input a module")
    }

    console.log(invokeModule)

    //get set
}

exports.unimplemented = unimplemented 



exports.implement =() => {}

