const fs = require('fs')
const path = require('path')


/**
 * here get plugin json from a path
 */
exports.getPlguinJson = fPath=>{
    var dir = fs.lstatSync(fPath).isFile() ? path.dirname(fPath) : fPath
    var pluginJsonPath = path.join(dir, 'plugin.json')
    if(fs.existsSync(pluginJsonPath)){
        return require(pluginJsonPath)
    }
    return {}
}