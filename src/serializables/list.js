import Serializable from './serializable.js'

class List extends Serializable {
  constructor(unit, length) {
    super(unit.view)
    this.unit = unit
    this._length = length
  }
  
  expand () {
    return this.unit.expand()
  }
  
  get length () {
    return this._length
  }
  
  serialize (offset, value) {
    var unit = this.unit
    var size = unit.size
    for (var i = 0; i < this.length; i++) {
      unit.serialize(offset, value[i])
      offset += size
    }
  }
  
  deserialize (view, offset) {
    var unit = this.unit
    var size = unit.size
    var result = Array(this.length)
    for (var i = 0; i < this.length; i++) {
      result[i] = unit.deserialize(offset)
      offset += size
    }
    return result
  }
}

export default List
