import Serializable from './serializables/serializable.js'
import Bool from './serializables/bool.js'
import Float from './serializables/float.js'
import Int from './serializables/int.js'
import Uint from './serializables/uint.js'

class Serializer {
  constructor (unit) {
    this.unit = unit
    this.units = unit.expand()
    this.buffer = new ArrayBuffer(0xff << 10)
    this.views = this.createViews(this.buffer)
    this.setViews()
  }
  
  createViews (buffer) {
    var views = new Map([
      [Uint8Array, new Uint8Array(buffer)],
      [Uint16Array, new Uint16Array(buffer)],
      [Uint32Array, new Uint32Array(buffer)],
      [Int8Array, new Int8Array(buffer)],
      [Int16Array, new Int16Array(buffer)],
      [Int32Array, new Int32Array(buffer)],
      [Float32Array, new Float32Array(buffer)]
    ])
    
    return views
  }
  
  setViews () {
    for (var i = 0; i < this.units.length; i++) {
      var unit = this.units[i]
      unit.view = this.views.get(unit.type)
    }
  }
  
  serialize (list) {
    var unit = this.unit
    var size = unit.size
    var offset = 0
    for (var i = 0; i < list.length; i++) {
      unit.serialize(offset, list[i])
      offset += size
    }
    
    return this.buffer
  }
  
  deserialize (buffer) {
    var unit = this.unit
    var size = unit.size
    var offset = 0
    var length = buffer.byteLength / size
    var result = Array(length)
    
    this.buffer = buffer
    this.views = this.createViews(this.buffer)
    this.setViews()
    
    for (var i = 0; i < length; i++) {
      result[i] = unit.deserialize(offset)
      offset += size
    }
    return result
  }
}

Serializer.Serializable = Serializable
Serializer.Bool = Bool
Serializer.Float = Float
Serializer.Int = Int
Serializer.Uint = Uint

export default Serializer
