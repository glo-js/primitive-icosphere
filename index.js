var icosphere = require('icosphere')
var normalize = require('gl-vec3/normalize')
var scale = require('gl-vec3/scale')
var triangleCentroid = require('triangle-centroid')

module.exports = function primitiveIcosphere (radius, opt) {
  opt = opt || {}
  radius = typeof radius !== 'undefined' ? radius : 1

  var subdivisions = typeof opt.subdivisions !== 'undefined' ? opt.subdivisions : 2
  var complex = icosphere(subdivisions)

  var normals = []
  var uvs = []
  var i

  for (i = 0; i < complex.positions.length; i++) {
    var position = complex.positions[i]
    scale(position, position, radius)

    var normal = normalize([0, 0, 0], position)
    var u = 0.5 * (-(getAzimuth(normal) / Math.PI) + 1.0)
    var v = 0.5 + Math.asin(normal[1]) / Math.PI

    normals.push(normal)
    uvs.push([ 1 - u, 1 - v ])
  }

  // will need to fix seams...
  var positions = complex.positions
  var cells = complex.cells
  for (i = 0; i < cells.length; i++) {
    var cell = cells[i]
    var a = cell[0]
    var b = cell[1]
    var c = cell[2]

    var p0 = positions[a]
    var p1 = positions[b]
    var p2 = positions[c]

    var centroid = triangleCentroid([ p0, p1, p2 ])
    var azimuth = getAzimuth(centroid)
    correctSeam(uvs[a], p0, azimuth)
    correctSeam(uvs[b], p1, azimuth)
    correctSeam(uvs[c], p2, azimuth)
  }

  return {
    positions: positions,
    cells: cells,
    uvs: uvs,
    normals: normals
  }
}

function getAzimuth (normal) {
  return Math.atan2(normal[2], -normal[0])
}

function correctSeam ( uv, vector, azimuth ) {
  if ( ( azimuth < 0) && ( uv[0] === 1)) {
    uv[0] = uv[0] - 1
  }
  if ( ( vector[0] === 0) && ( vector[2] === 0)) {
    uv[0] = azimuth / 2 / Math.PI + 0.5
  }
}
