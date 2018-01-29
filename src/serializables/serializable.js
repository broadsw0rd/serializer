class Serializable {
  constructor (view = new Uint8Array(), offset = 0) {
    this.view = view
    this.offset = offset
  }

  encode (value) {
    return value
  }

  decode (value) {
    return value
  }

  expand () {
    return [this]
  }

  serialize (offset, value) {
    this.view[offset + this.offset] = this.encode(value)
  }

  deserialize (offset) {
    return this.decode(this.view[offset + this.offset])
  }

  get length () {
    return 1
  }

  get bytes () {
    return this.type.BYTES_PER_ELEMENT
  }

  get size () {
    return this.length * this.bytes
  }

  get type () {
    return this.view.constructor
  }
}

export default Serializable
