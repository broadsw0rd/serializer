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

  var prototypeAccessors = { length: { configurable: true },bytes: { configurable: true },size: { configurable: true },type: { configurable: true } };

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

  var Text = (function (Serializable$$1) {
    function Text (length, view) {
      if ( view === void 0 ) view = new Uint16Array();

      Serializable$$1.call(this, view);
      this._length = length;
    }

    if ( Serializable$$1 ) Text.__proto__ = Serializable$$1;
    Text.prototype = Object.create( Serializable$$1 && Serializable$$1.prototype );
    Text.prototype.constructor = Text;

    var prototypeAccessors = { length: { configurable: true } };

    prototypeAccessors.length.get = function () {
      return this._length
    };

    Text.prototype.serialize = function serialize (offset, value) {
      var this$1 = this;

      var size = this.size;
      for (var i = 0; i < this.length; i++) {
        if (i < value.length) {
          Serializable$$1.prototype.serialize.call(this$1, offset, value.charCodeAt(i));
        } else {
          break
        }
        offset += size;
      }
    };

    Text.prototype.deserialize = function deserialize (offset) {
      var this$1 = this;

      var chars = [];
      var size = this.size;
      for (var i = 0; i < this.length; i++) {
        var value = Serializable$$1.prototype.deserialize.call(this$1, offset);
        if (value !== 0) {
          chars.push(value);
        } else {
          break
        }
        offset += size;
      }
      return String.fromCharCode.apply(String, chars)
    };

    Object.defineProperties( Text.prototype, prototypeAccessors );

    return Text;
  }(Serializable));

  var List = (function (Serializable$$1) {
    function List (unit, length) {
      Serializable$$1.call(this, unit.view);
      this.unit = unit;
      this._length = length;
    }

    if ( Serializable$$1 ) List.__proto__ = Serializable$$1;
    List.prototype = Object.create( Serializable$$1 && Serializable$$1.prototype );
    List.prototype.constructor = List;

    var prototypeAccessors = { length: { configurable: true } };

    List.prototype.expand = function expand () {
      return this.unit.expand()
    };

    prototypeAccessors.length.get = function () {
      return this._length
    };

    List.prototype.serialize = function serialize (offset, value) {
      var unit = this.unit;
      var size = unit.size;
      for (var i = 0; i < this.length; i++) {
        unit.serialize(offset, value[i]);
        offset += size;
      }
    };

    List.prototype.deserialize = function deserialize (view, offset) {
      var unit = this.unit;
      var size = unit.size;
      var result = Array(this.length);
      for (var i = 0; i < this.length; i++) {
        result[i] = unit.deserialize(offset);
        offset += size;
      }
      return result
    };

    Object.defineProperties( List.prototype, prototypeAccessors );

    return List;
  }(Serializable));

  function comparator (a, b) {
    return (a.bytes < b.bytes) - (b.bytes - a.bytes)
  }

  var Struct = (function (Serializable$$1) {
    function Struct (scheme) {
      Serializable$$1.call(this);
      this.scheme = scheme;
      this.keys = Object.keys(scheme);
      this.units = this.expand();
      this._size = this.cacheSize();
      this.setOffsets();
    }

    if ( Serializable$$1 ) Struct.__proto__ = Serializable$$1;
    Struct.prototype = Object.create( Serializable$$1 && Serializable$$1.prototype );
    Struct.prototype.constructor = Struct;

    var prototypeAccessors = { size: { configurable: true } };

    Struct.prototype.expand = function expand () {
      var this$1 = this;

      var result = [];
      for (var i = 0; i < this.keys.length; i++) {
        var unit = this$1.scheme[this$1.keys[i]];
        result = result.concat(unit.expand());
      }
      return result.sort(comparator)
    };

    Struct.prototype.cacheSize = function cacheSize () {
      var this$1 = this;

      var size = 0;
      for (var i = 0; i < this.keys.length; i++) {
        size += this$1.scheme[this$1.keys[i]].size;
      }
      return size
    };

    Struct.prototype.setOffsets = function setOffsets () {
      var this$1 = this;

      var offset = 0;
      for (var i = 0; i < this.units.length; i++) {
        var unit = this$1.units[i];
        unit.offset = offset;
        offset += unit.size;
      }
    };

    prototypeAccessors.size.get = function () {
      return this._size
    };

    Struct.prototype.serialize = function serialize (offset, value) {
      var this$1 = this;

      for (var i = 0; i < this.keys.length; i++) {
        var key = this$1.keys[i];
        var unit = this$1.scheme[key];
        unit.serialize(offset, value[key]);
      }
    };

    Struct.prototype.deserialize = function deserialize (offset) {
      var this$1 = this;

      var result = {};
      for (var i = 0; i < this.keys.length; i++) {
        var key = this$1.keys[i];
        var unit = this$1.schema[key];
        result[key] = unit.deserialize(offset);
      }
      return result
    };

    Object.defineProperties( Struct.prototype, prototypeAccessors );

    return Struct;
  }(Serializable));

  var Serializer = function Serializer (unit) {
    this.unit = unit;
    this.units = unit.expand();
  };

  Serializer.prototype.createViews = function createViews (buffer) {
    var views = new Map([
      [Uint8Array, new Uint8Array(buffer)],
      [Uint16Array, new Uint16Array(buffer)],
      [Uint32Array, new Uint32Array(buffer)],
      [Int8Array, new Int8Array(buffer)],
      [Int16Array, new Int16Array(buffer)],
      [Int32Array, new Int32Array(buffer)],
      [Float32Array, new Float32Array(buffer)]
    ]);

    this.views = views;
  };

  Serializer.prototype.setViews = function setViews () {
      var this$1 = this;

    for (var i = 0; i < this.units.length; i++) {
      var unit = this$1.units[i];
      unit.view = this$1.views.get(unit.type);
    }
  };

  Serializer.prototype.serialize = function serialize (list) {
    var unit = this.unit;
    var size = unit.size;
    var offset = 0;
    var length = list.length;

    this.buffer = new ArrayBuffer(length * size);
    this.createViews(this.buffer);
    this.setViews();

    for (var i = 0; i < list.length; i++) {
      unit.serialize(offset, list[i]);
      offset += size;
    }

    return this.buffer
  };

  Serializer.prototype.deserialize = function deserialize (buffer) {
    var unit = this.unit;
    var size = unit.size;
    var offset = 0;
    var length = buffer.byteLength / size;
    var result = Array(length);

    this.buffer = buffer;
    this.createViews(this.buffer);
    this.setViews();

    for (var i = 0; i < length; i++) {
      result[i] = unit.deserialize(offset);
      offset += size;
    }
    return result
  };

  Serializer.Serializable = Serializable;
  Serializer.Bool = Bool;
  Serializer.Float = Float;
  Serializer.Int = Int;
  Serializer.Uint = Uint;
  Serializer.Text = Text;
  Serializer.List = List;
  Serializer.Struct = Struct;

  return Serializer;

})));
