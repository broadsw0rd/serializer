(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Serializer = factory());
}(this, (function () { 'use strict';

var Serializable = function Serializable (view, offset) {
  if ( view === void 0 ) view = new Uint8Array();
  if ( offset === void 0 ) offset = 0;

  this.view = view;
  this.offset = offset;
};

var prototypeAccessors = { length: {},bytes: {},size: {},type: {} };

Serializable.prototype.encode = function encode (value) {
  return value
};

Serializable.prototype.decode = function decode (value) {
  return value
};

Serializable.prototype.expand = function expand () {
  return [this]
};

Serializable.prototype.serialize = function serialize (offset, value) {
  this.view[offset + this.offset] = this.encode(value);
};

Serializable.prototype.deserialize = function deserialize (offset) {
  return this.decode(this.view[offset + this.offset])
};

prototypeAccessors.length.get = function () {
  return 1
};

prototypeAccessors.bytes.get = function () {
  return this.type.BYTES_PER_ELEMENT
};

prototypeAccessors.size.get = function () {
  return this.length * this.bytes
};

prototypeAccessors.type.get = function () {
  return this.view.constructor
};

Object.defineProperties( Serializable.prototype, prototypeAccessors );

var Bool = (function (Serializable$$1) {
  function Bool () {
    Serializable$$1.apply(this, arguments);
  }

  if ( Serializable$$1 ) Bool.__proto__ = Serializable$$1;
  Bool.prototype = Object.create( Serializable$$1 && Serializable$$1.prototype );
  Bool.prototype.constructor = Bool;

  Bool.prototype.encode = function encode (value) {
    return Number(value)
  };

  Bool.prototype.decode = function decode (value) {
    return Boolean(value)
  };

  return Bool;
}(Serializable));

var types = {
  32: Float32Array,
  64: Float64Array
};

var Float = (function (Serializable$$1) {
  function Float (bytes) {
    Serializable$$1.call(this, new types[bytes]());
  }

  if ( Serializable$$1 ) Float.__proto__ = Serializable$$1;
  Float.prototype = Object.create( Serializable$$1 && Serializable$$1.prototype );
  Float.prototype.constructor = Float;

  return Float;
}(Serializable));

var types$1 = {
  8: Int8Array,
  16: Int16Array,
  32: Int32Array
};

var Int = (function (Serializable$$1) {
  function Int (bytes) {
    Serializable$$1.call(this, new types$1[bytes]());
  }

  if ( Serializable$$1 ) Int.__proto__ = Serializable$$1;
  Int.prototype = Object.create( Serializable$$1 && Serializable$$1.prototype );
  Int.prototype.constructor = Int;

  return Int;
}(Serializable));

var types$2 = {
  8: Uint8Array,
  16: Uint16Array,
  32: Uint32Array
};

var Uint = (function (Serializable$$1) {
  function Uint (bytes) {
    Serializable$$1.call(this, new types$2[bytes]());
  }

  if ( Serializable$$1 ) Uint.__proto__ = Serializable$$1;
  Uint.prototype = Object.create( Serializable$$1 && Serializable$$1.prototype );
  Uint.prototype.constructor = Uint;

  return Uint;
}(Serializable));

var Serializer = function Serializer () {};

Serializer.Serializable = Serializable;
Serializer.Bool = Bool;
Serializer.Float = Float;
Serializer.Int = Int;
Serializer.Uint = Uint;

return Serializer;

})));
