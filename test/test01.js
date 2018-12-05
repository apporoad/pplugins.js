var engine = require('../engine')

var test = require('./others/test.use')

test.hello()

engine.inject(test,"test")

test.hello()
