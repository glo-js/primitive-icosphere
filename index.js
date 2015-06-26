var icosphere = require('icosphere')
var normalize = require('gl-vec3/normalize')
var scale = require('gl-vec3/scale')

module.exports = function primitiveIcosphere (radius, opt) {
  opt = opt || {}
  radius = typeof radius !== 'undefined' ? radius : 1

  var subdivisions = typeof opt.subdivisions !== 'undefined' ? opt.subdivisions : 2
  var complex = icosphere(subdivisions)

  var normals = []
  var uvs = []
  for (var i = 0; i < complex.positions.length; i++) {
    var position = complex.positions[i]
    scale(position, position, radius)

    var normal = normalize([0, 0, 0], position)
    var u = 0.5 * (-(Math.atan2(normal[2], -normal[0]) / Math.PI) + 1.0)
    var v = 0.5 + Math.asin(normal[1]) / Math.PI
    normals.push(normal)
    uvs.push([ 1 - u, 1 - v ])
  }

  return {
    positions: complex.positions,
    cells: complex.cells,
    uvs: uvs,
    normals: normals
  }
}
