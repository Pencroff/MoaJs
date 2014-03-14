!function() {
    Object.create || (Object.create = function() {
        function F() {}
        return function(o) {
            if (1 !== arguments.length) throw new Error("Object.create implementation only accepts one parameter.");
            F.prototype = o;
            return new F();
        };
    }());
    var undef, fn = "function", ob = "object", un = "undefined", map = {}, mixins = {}, extend = function(target, source) {
        var prop;
        for (prop in source) source.hasOwnProperty(prop) && (target[prop] = source[prop]);
        target.toString = source.toString;
        target.valueOf = source.valueOf;
        target.toLocaleString = source.toLocaleString;
        return target;
    }, throwWrongParamsErr = function(method, param) {
        var msg = "Wrong parameters in " + method;
        param && (msg = "Wrong parameter " + param + " in " + method);
        throw new Error(msg, "Moa");
    }, throwWrongType = function(obj, extendType, isMixin) {
        var undef, type = "Type ";
        if (obj === undef) {
            isMixin === !0 && (type = "Mixin type ");
            throw new Error(type + extendType + " not found", "Moa");
        }
    }, addMixins = function($proto, $mixin) {
        var prop, value, MixFn;
        for (prop in $mixin) {
            value = $mixin[prop];
            MixFn = mixins[value];
            throwWrongType(MixFn, value, !0);
            MixFn.call($proto);
            $proto[prop] = new MixFn();
        }
        return $proto;
    }, build = function(type, base, definition) {
        var basetype, $staticMixin, $single = definition.$single, $static = definition.$static, $mixin = definition.$mixin, $ctor = definition.$ctor, $di = definition.$di, $base = {};
        $ctor !== undef ? delete definition.$ctor : $ctor = function() {};
        delete definition.$single;
        delete definition.$static;
        delete definition.$mixin;
        delete definition.$extend;
        if ($static !== undef) {
            $staticMixin = $static.$mixin;
            if ($staticMixin !== undef) {
                delete $static.$mixin;
                addMixins($ctor, $staticMixin);
            }
            extend($ctor, $static);
        }
        $mixin !== undef && (definition = extend(addMixins({}, $mixin), definition));
        if (base !== undef) {
            basetype = base.$type;
            definition = extend(Object.create(base.$ctor.prototype), definition);
        }
        definition.getType = function() {
            return type;
        };
        extend($base, definition);
        $ctor.prototype = definition;
        $ctor.prototype.constructor = $ctor;
        $single !== undef && $single === !0 && !function() {
            var instance = new $ctor();
            $ctor = function() {
                return instance;
            };
            $ctor.getInstance = function() {
                return instance;
            };
        }();
        $base.$ctor = $ctor;
        return {
            $type: type,
            $basetype: basetype,
            $mixin: $mixin,
            $di: $di,
            $ctor: $ctor,
            $base: $base
        };
    }, Moa = {
        define: function(type, definition) {
            var mapObj, baseType, base, len = arguments.length;
            switch (len) {
              case 1:
                mapObj = map[type];
                throwWrongType(mapObj, type);
                break;

              case 2:
                switch (typeof definition) {
                  case fn:
                    baseType = definition().$extend;
                    if (baseType !== undef) {
                        base = map[baseType];
                        throwWrongType(base, baseType);
                        mapObj = build(type, base, definition(base.$base));
                    } else mapObj = build(type, undef, definition(undef));
                    break;

                  case ob:
                    if (null === definition) {
                        delete map[type];
                        return undef;
                    }
                    baseType = definition.$extend;
                    if (baseType !== undef) {
                        base = map[baseType];
                        throwWrongType(base, baseType);
                    }
                    mapObj = build(type, base, definition);
                    break;

                  default:
                    throwWrongParamsErr("define", "definition");
                }
                map[type] = mapObj;
                break;

              default:
                throwWrongParamsErr("define");
            }
            return mapObj.$ctor;
        },
        mixin: function(mixType, definition) {
            if (null !== definition) {
                typeof definition !== fn && throwWrongParamsErr("mixin", "definition");
                mixins[mixType] = definition;
            } else delete mixins[mixType];
        },
        resolve: function(type) {
            var prop, result, Ctor = Moa.define(type), info = Moa.getTypeInfo(type), di = info.$di;
            result = new Ctor();
            for (prop in di) {
                Ctor = Moa.define(di[prop]);
                result[prop] = new Ctor();
            }
            return result;
        },
        getRegistry: function() {
            var iterate = function(obj) {
                var prop, arr = [];
                for (prop in obj) arr.push(prop);
                return arr;
            };
            return {
                type: iterate(map),
                mixin: iterate(mixins)
            };
        },
        getTypeInfo: function(type) {
            var result, mapObj = map[type];
            throwWrongType(mapObj, type);
            result = extend({}, mapObj);
            delete result.$ctor;
            delete result.$base;
            return result;
        }
    };
    typeof define !== un ? define("Moa", [], function() {
        return Moa;
    }) : typeof window !== un ? window.Moa = Moa : module.exports = Moa;
}();