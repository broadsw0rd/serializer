import Serializable from './serializable.js'

class Bool extends Serializable {
  encode (value) {
    return Number(value)
  }

  decode (value) {
    return Boolean(value)
  }
}

export default Bool
