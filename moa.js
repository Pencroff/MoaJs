(function() {
    Object.create || (Object.create = function() {
        function F() {}
        return function(o) {
            if (1 !== arguments.length) throw new Error("Object.create implementation only accepts one parameter.");
            F.prototype = o;
            return new F();
        };
    }());
    var undef, fn = "function", ob = "object", $proto$ = function() {
        var obj, type = "$prototype$", ctor = function() {};
        ctor.prototype = {
            getType: function() {
                return type;
            }
        };
        ctor.prototype.constructor = ctor;
        obj = new ctor();
        obj.$ctor = ctor;
        return {
            $type: obj.getType(),
            $basetype: undef,
            $ctor: ctor,
            $base: obj
        };
    }(), map = {
        $prototype$: $proto$
    }, extend = function(target, source) {
        var prop;
        for (prop in source) source.hasOwnProperty(prop) && (target[prop] = source[prop]);
        return target;
    }, wrongParamsErr = function(method, param) {
        var msg = "Wrong parameters in " + method;
        param && (msg = "Wrong parameter " + param + " in " + method);
        return new Error(msg, "Moa");
    }, wrongType = function(extendType) {
        return new Error("Type " + extendType + " not found", "Moa");
    }, build = function(type, base, definition) {
        var basetype, $ctor = definition.$ctor, $base = {};
        $ctor !== undef ? delete definition.$ctor : $ctor = function() {};
        delete definition.$extend;
        basetype = base.$basetype;
        definition = extend(Object.create(base.$ctor.prototype), definition);
        definition.getType = function() {
            return type;
        };
        extend($base, definition);
        $ctor.prototype = definition;
        $ctor.prototype.constructor = $ctor;
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
                    baseType === undef && (baseType = "$prototype$");
                    base = map[baseType];
                    if (base === undef) throw wrongType(baseType);
                    mapObj = build(type, base, definition(base.$base));
                    break;

                  case ob:
                    if (null === definition) {
                        delete map[type];
                        return undef;
                    }
                    baseType = definition.$extend;
                    baseType === undef && (baseType = "$prototype$");
                    base = map[baseType];
                    if (base === undef) throw wrongType(baseType);
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
        }
    };
    define !== undef ? define("Moa", [], function() {
        return Moa;
    }) : window !== undef ? window.Moa = Moa : module.exports = Moa;
})();