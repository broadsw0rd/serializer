import Serializable from './serializables/serializable.js'
import Bool from './serializables/bool.js'
import Float from './serializables/float.js'
import Int from './serializables/int.js'
import Uint from './serializables/uint.js'

class Serializer {}

Serializer.Serializable = Serializable
Serializer.Bool = Bool
Serializer.Float = Float
Serializer.Int = Int
Serializer.Uint = Uint

export default Serializer
