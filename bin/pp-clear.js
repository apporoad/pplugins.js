const uicli = require('uicli.js')

uicli.uiGetJson({ isClear :"???(b)[false]be sure to clear all?"}).then(d=>{
    if(d.isClear){
        require('../cli').clear()

        console.log('clear all ...')
    }
})