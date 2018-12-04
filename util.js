var Type = (function() {
    var type = {};
    var typeArr = ['String', 'Object', 'Number', 'Array','Undefined', 'Function', 'Null', 'Symbol','Boolean','RegExp'];
    for (var i = 0; i < typeArr.length; i++) {
        (function(name) {
            type['is' + name] = function(obj) {
                return Object.prototype.toString.call(obj) == '[object ' + name + ']';
            }
        })(typeArr[i]);
    }
    return type;
})();

var endWith=function(str,s){
    if(s==null||s==""||str.length==0||s.length>str.length)
       return false;
    if(str.substring(str.length-s.length)==s)
       return true;
    else
       return false;
   }

exports.endTrim=(str,end) =>{
   if(endWith(str,end)){
      return str.substring(0,str.length - end.length)
   }
   return str
}
var startWith=function(str,s){
    if(s==null||s==""|| str==null || str==""||str.length==0||s.length>str.length)
       return false;
    if(str.substr(0,s.length)==s)
       return true;
    else
       return false;
   }



exports.Type = Type
exports.endWith =endWith
exports.startWith = startWith


exports.indexOfString = (str,searchStr) =>{
    if(!str || !searchStr){
        return -1
    }
    if(searchStr.length > 2 && endWith(searchStr,'/') && startWith(searchStr,'/')){
        //正则匹配
        var re =  new RegExp(searchStr.substring(1,searchStr.length-1),"mg")
        var arr;
        while ((arr = re.exec(str)) != null)
            return arr.index  //print(arr.index + "-" + arr.lastIndex + "\t" + arr);
        return -1
    }
    else{
        return str.indexOf(searchStr)
    }
}
var indexOfString = exports.indexOfString

exports.indexOf= (str, search) =>{
    if(!str || !search){
        return -1
    }
    if(Type.isString(search)){
        return indexOfString(str,search)
    }
    else if(Type.isNumber(search)){
        re = new RegExp(/\n/,"mg")
        var nArr = new Array()
        var temp=null
        while ((temp = re.exec(str)) != null)
            nArr.push(temp.index)
        if(search >=0){
            if(search ==0)
                return 0
            if(search-1 < nArr.length){
                return nArr[search-1]
            }
            else{
                //? maybe should know
                return -1
            }
        }else
        {
            var activeIndex = nArr.length + search
            if(activeIndex > -1){
                return nArr[activeIndex]
            }else{
                //?  maybe should know
                return -1
            }
        }
    }
    else{
        throw Error('pplugins:util: unsupport search type')
    }
}


