import Serializable from './serializable.js'

function comparator (a, b) {
  return (a.bytes < b.bytes) - (b.bytes - a.bytes)
}

class Struct extends Serializable {
  constructor (scheme) {
    super()
    this.scheme = scheme
    this.keys = Object.keys(scheme)
    this.units = this.expand()
    this._size = this.cacheSize()
    this.setOffsets()
  }

  expand () {
    var result = []
    for (var i = 0; i < this.keys.length; i++) {
      var unit = this.scheme[this.keys[i]]
      result = result.concat(unit.expand())
    }
    return result.sort(comparator)
  }

  cacheSize () {
    var size = 0
    for (var i = 0; i < this.keys.length; i++) {
      size += this.scheme[this.keys[i]].size
    }
    return size
  }

  setOffsets () {
    var offset = 0
    for (var i = 0; i < this.units.length; i++) {
      var unit = this.units[i]
      unit.offset = offset
      offset += unit.size
    }
  }

  get size () {
    return this._size
  }

  serialize (offset, value) {
    for (var i = 0; i < this.keys.length; i++) {
      var key = this.keys[i]
      var unit = this.scheme[key]
      unit.serialize(offset, value[key])
    }
  }

  deserialize (offset) {
    var result = {}
    for (var i = 0; i < this.keys.length; i++) {
      var key = this.keys[i]
      var unit = this.schema[key]
      result[key] = unit.deserialize(offset)
    }
    return result
  }
}

export default Struct
