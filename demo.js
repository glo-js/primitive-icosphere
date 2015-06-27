var mesh = require('./')(1, {
  subdivisions: 0
})

var app = require('glo-demo-primitive')(mesh, {
  repeat: [10, 10]
}).start()