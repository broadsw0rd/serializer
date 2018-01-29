import Serializable from './serializable.js'

const types = {
  8: Uint8Array,
  16: Uint16Array,
  32: Uint32Array
}

class Uint extends Serializable {
  constructor (bytes) {
    super(new types[bytes]())
  }
}

export default Uint
