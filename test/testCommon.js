var path = require('path')


var igetTopScanPath = dir=>{
    //recurse find a dir with node_modules or package.json as topScanPath
    //todos
    var dirs = new Array()

    var currentDir = dir
    while(true){
        dirs.push(currentDir)
        if(currentDir == path.dirname(currentDir)){
            break
        }
        currentDir = path.dirname(currentDir)
        console.log(currentDir)
    }
    console.log(dirs.pop())
}



igetTopScanPath(__dirname)