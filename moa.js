(function() {
    Object.create || (Object.create = function() {
        function F() {}
        return function(o) {
            if (1 !== arguments.length) throw new Error("Object.create implementation only accepts one parameter.");
            F.prototype = o;
            return new F();
        };
    }());
    var undef, fn = "function", ob = "object", un = "undefined", map = {}, mixins = {}, extend = function() {
        var fn;
        fn = Object.keys ? function(target, source) {
            for (var prop, keys = Object.keys(source), len = keys.length, i = 0; len > i; ) {
                prop = keys[i];
                target[prop] = source[prop];
                i += 1;
            }
            return target;
        } : function(target, source) {
            var prop;
            for (prop in source) source.hasOwnProperty(prop) && (target[prop] = source[prop]);
            target.toString = source.toString;
            target.valueOf = source.valueOf;
            target.toLocaleString = source.toLocaleString;
            return target;
        };
        return fn;
    }(), wrongParamsErr = function(method, param) {
        var msg = "Wrong parameters in " + method;
        param && (msg = "Wrong parameter " + param + " in " + method);
        return new Error(msg, "Moa");
    }, wrongType = function(extendType, isMixin) {
        var type = "Type ";
        isMixin === !0 && (type = "Mixin type ");
        return new Error(type + extendType + " not found", "Moa");
    }, addMixins = function($proto, $mixin) {
        for (var prop, value, MixFn, keys = Object.keys($mixin), len = keys.length, i = 0; len > i; ) {
            prop = keys[i];
            value = $mixin[prop];
            MixFn = mixins[value];
            if (MixFn === undef) throw wrongType(value, !0);
            MixFn.call($proto);
            $proto[prop] = new MixFn();
            i += 1;
        }
        return $proto;
    }, build = function(type, base, definition) {
        var basetype, $single = definition.$single, $static = definition.$static, $mixin = definition.$mixin, $ctor = definition.$ctor, $base = {};
        $ctor !== undef ? delete definition.$ctor : $ctor = function() {};
        delete definition.$single;
        delete definition.$static;
        delete definition.$mixin;
        delete definition.$extend;
        $static !== undef && extend($ctor, $static);
        $mixin !== undef && (definition = extend(addMixins({}, $mixin), definition));
        if (base !== undef) {
            basetype = base.$basetype;
            definition = extend(Object.create(base.$ctor.prototype), definition);
        }
        definition.getType = function() {
            return type;
        };
        extend($base, definition);
        $ctor.prototype = definition;
        $ctor.prototype.constructor = $ctor;
        $single !== undef && $single === !0 && function() {
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
            $ctor: $ctor,
            $base: $base
        };
    }, Moa = {
        define: function(type, definition) {
            var mapObj, baseType, base, len = arguments.length;
            switch (len) {
              case 1:
                mapObj = map[type];
                if (!mapObj) throw wrongType(type);
                break;

              case 2:
                switch (typeof definition) {
                  case fn:
                    baseType = definition().$extend;
                    if (baseType !== undef) {
                        base = map[baseType];
                        if (base === undef) throw wrongType(baseType);
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
                        if (base === undef) throw wrongType(baseType);
                    }
                    mapObj = build(type, base, definition);
                    break;

                  default:
                    throw wrongParamsErr("define", "definition");
                }
                map[type] = mapObj;
                break;

              default:
                throw wrongParamsErr("define");
            }
            return mapObj.$ctor;
        },
        mixin: function(mixType, definition) {
            typeof definition !== fn && wrongParamsErr("definition", "mixin");
            mixins[mixType] = definition;
        }
    };
    typeof define !== un ? define("Moa", [], function() {
        return Moa;
    }) : typeof window !== un ? window.Moa = Moa : module.exports = Moa;
})();