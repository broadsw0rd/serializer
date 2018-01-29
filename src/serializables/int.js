import Serializable from './serializable.js'

const types = {
  8: Int8Array,
  16: Int16Array,
  32: Int32Array
}

class Int extends Serializable {
  constructor (bytes) {
    super(new types[bytes]())
  }
}

export default Int
