import Serializable from './serializable.js'

class Text extends Serializable {
  constructor(length, view = new Uint16Array) {
    super(view)
    this._length = length
  }
  
  get length() {
    return this._length
  }
  
  serialize (offset, value) {
    var size = this.size
    for (var i = 0; i < this.length; i++) {
      if (i < value.length) {
        super.serialize(offset, value.charCodeAt(i))
      } else {
        break
      }
      offset += size
    }
  }
  
  deserialize (offset) {
    var chars = []
    var size = this.size
    for (var i = 0; i < this.length; i++) {
      var value = super.deserialize(offset)
      if (value !== 0) {
        chars.push(value)
      } else {
        break
      }
      offset += size
    }
    return String.fromCharCode(...chars)
  }
}

export default Text
