import Serializable from './serializable.js'

const types = {
  32: Float32Array,
  64: Float64Array
}

class Float extends Serializable {
  constructor (bytes) {
    super(new types[bytes]())
  }
}

export default Float
