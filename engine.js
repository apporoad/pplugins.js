const ioc = require('peeriocjs')
const util = require('./util')


exports.run =()=>{}


var icheckInject = inputModule =>{
    //todo
}
/**
 *  inject your module with unreged methods
 */
exports.inject=(inputModule,pluginName) =>{
    icheckInject(inputModule)

    //console.log(inputModule)
    for(var mt in inputModule){
        var element = inputModule[mt]
        if(util.Type.isFunction(element)){
            //console.log(element)
            //todo
            inputModule[mt] = function(){console.log('hello good day')}
        }
    }
}