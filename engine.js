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
    if(!pluginName){
        //todo read config
    }
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

exports.autoInject = ()=>{}


exports.checkProxy = (origin,proxy,verbose) =>{
    //todo
}

exports.setProxy =(origin, proxy ) =>{
    //override proxy
    origin.iproxy = proxy
    //check proxy match origin
    exports.checkProxy(origin,proxy,true)
    if(util.Type.isObject(origin) || util.Type.isFunction(origin)){
        // console.log('aaaaaaaaaaaa')
        for(var key in origin){
            //ignore iproxy
            if(key == "iproxy")
            {
                continue
            }
            var val = origin[key]
            if(util.Type.isFunction(val)){
                //console.log("aaaaaaaaaaaaaaaaaa:" +key)
                //set function proxy
                //closure
                var generate = ()=>{
                    var keepKey = key
                    return  ((...params)=>{ 
                        //console.log("CCCCCCCCCCCCCC:" + keepKey)
                        var p = origin.iproxy
                        //if has proxy
                        if(p){
                            if(!p[keepKey]){
                                console.error("proxy: your proxy method undefined :" + keepKey )
                                throw new Error("proxy: your proxy method undefined :" + keepKey )
                            }
                            if(!util.Type.isFunction(p[keepKey])){
                                console.trace()
                                console.error("proxy: your proxy."+ keepKey+" must be a function ")
                                throw new Error("proxy: your proxy."+ keepKey + " must be a function ")
                            }
                            return p[keepKey].apply(p,arguments)
                        }else{
                            console.error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                            throw new Error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                        }
                        //console.log('here proxy method :' + key)
                    }).bind(origin)
                }

                origin[key] = generate()
            } else{
                //console.log("bbbbbbbbbbbbbbb:" + key)
                // ison[key] = "proxy val :" + val
            
                //closure
                var gGet = ()=>{
                    var keepKey = key
                    return  function() {
                        if(origin.iproxy){
                            return origin.iproxy[keepKey]
                        }
                        console.error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                        throw new Error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                    }
                }
                var gSet = ()=>{
                    var keepKey = key
                    return function(value) {
                        if(origini.iproxy){
                            origin.iproxy[keepKey] = value
                        }
                        console.error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                        throw new Error("proxy: your iproxy have be removed ,please check your code : " + keepKey)
                    }
                }

                // todo get set 
                Object.defineProperty(origin, key, {
                    get: gGet(),
                    set: gSet()
                })
            }
        }
    }
    else{
        console.error("ppulgins:engine: only Object or Function can setProxy :" + origin)
    }

    //console.log(origin.iproxy)
}
