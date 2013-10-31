(function() {
    Object.create || (Object.create = function() {
        function F() {}
        return function(o) {
            if (1 !== arguments.length) throw new Error("Object.create implementation only accepts one parameter.");
            F.prototype = o;
            return new F();
        };
    }());
    var map = {}, fn = "function", undef = "undefined", extend = function(target, source, isOverride) {
        var prop;
        if (isOverride) for (prop in source) source.hasOwnProperty(prop) && (target[prop] = source[prop]); else for (prop in source) source.hasOwnProperty(prop) && (target[prop] || (target[prop] = source[prop]));
        return target;
    }, notFoundErr = function(type) {
        return new Error("Object '" + type + "' not found", "obj");
    }, wrongParamsErr = function(method) {
        return new Error("Wrong parameters in " + method, "obj");
    }, buildMapObj = function(t, o) {
        var parent, isSingle = o.$isSingle, extendType = o.$extend, construct = o.$construct, $proto = {}, $mapObj = {
            $proto: $proto,
            $extend: extendType,
            $mixin: o.$mixin,
            $static: o.$static,
            $isSingle: isSingle
        };
        typeof construct === fn ? delete o.$construct : construct = function() {};
        delete o.$isSingle;
        delete o.$extend;
        delete o.$mixin;
        delete o.$static;
        extend($proto, o, !0);
        if (extendType) {
            parent = map[extendType];
            if (!parent) throw new Error("Base type not found");
            $proto = extend(Object.create(parent.$proto), $proto, !0);
            $proto.$base = parent.$constructor;
            $proto.$baseproto = parent.$proto;
            $mapObj.$proto = $proto;
        }
        $proto.$getType = function() {
            return t;
        };
        $mapObj.$constructor = construct;
        $mapObj.$constructor.prototype = $proto;
        $mapObj.$constructor.prototype.constructor = construct;
        return $mapObj;
    }, Moa = {
        define: function(objName, secondParam) {
            var mapObj, len = arguments.length;
            switch (len) {
              case 1:
                mapObj = map[objName];
                if (!mapObj) throw notFoundErr(objName);
                break;

              case 2:
                if (null === secondParam) {
                    delete map[objName];
                    return;
                }
                mapObj = buildMapObj(objName, secondParam);
                map[objName] = mapObj;
                break;

              default:
                throw wrongParamsErr("define");
            }
            return mapObj.$constructor;
        },
        create: function(objName) {
            var mapObj, item, args, ret, len = arguments.length;
            mapObj = map[objName];
            if (!mapObj) throw notFoundErr(objName);
            if (1 === len) return new mapObj.$constructor();
            item = Object.create(mapObj.$proto);
            args = Array.prototype.slice.call(arguments, 1);
            ret = mapObj.$constructor.apply(item, args);
            return Object(ret) === ret ? ret : item;
        }
    };
    typeof define !== undef ? define("moa-noDeps", [], function() {
        return Moa;
    }) : typeof window !== undef ? window.Moa = Moa : module.exports = Moa;
})();