/*********************************************
   The MIT License (MIT)
   Copyright (c) 2013 - 2014 Sergii Danilov
   MoaJs - v0.1.3 - 2014-04-08
*********************************************/
!function() {
    Object.create || (Object.create = function() {
        function F() {}
        return function(o) {
            if (1 !== arguments.length) throw new Error("Object.create implementation only accepts one parameter.");
            F.prototype = o;
            return new F();
        };
    }());
    var undef, map = {}, mixins = {}, extend = function(target, source) {
        var prop;
        if (source) {
            for (prop in source) source.hasOwnProperty(prop) && (target[prop] = source[prop]);
            target.toString = source.toString;
            target.valueOf = source.valueOf;
            target.toLocaleString = source.toLocaleString;
        }
        return target;
    }, fastExtend = function(target, source) {
        var prop;
        for (prop in source) target[prop] = source[prop];
        return target;
    }, throwWrongParamsErr = function(method, param) {
        var msg = "Wrong parameters in " + method;
        param && (msg = "Wrong parameter " + param + " in " + method);
        throw new Error(msg, "Moa");
    }, throwWrongType = function(obj, extendType, isMixin) {
        var type = "Type ";
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
    }, resolveDeclaration = function(type, diConfiguration, owner) {
        var configurationProperty, configurationValue, configurationValueType, typeObj, propFlag = !1;
        diConfiguration = diConfiguration || {};
        diConfiguration.$current || (diConfiguration.$current = type);
        for (configurationProperty in diConfiguration) {
            configurationValue = diConfiguration[configurationProperty];
            configurationValueType = typeof configurationValue;
            switch (configurationProperty) {
              case "$current":
                switch (configurationValueType) {
                  case "string":
                    configurationValue = {
                        type: configurationValue,
                        instance: "item",
                        lifestyle: "transient"
                    };
                    break;

                  case "object":
                    configurationValue.type = type;
                    configurationValue.instance || (configurationValue.instance = "item");
                    configurationValue.lifestyle || "ctor" === configurationValue.instance || (configurationValue.lifestyle = "transient");
                }
                break;

              case "$ctor":
                configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
                delete configurationValue.$current;
                break;

              case "$proto":
                configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
                delete configurationValue.$current;
                break;

              case "$prop":
                configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
                delete configurationValue.$current;
                break;

              default:
                propFlag = !0;
                switch (configurationValueType) {
                  case "string":
                    typeObj = map[configurationValue];
                    if (typeObj) if ("$proto" === owner) {
                        configurationValue = fastExtend({}, typeObj.$di.$current);
                        configurationValue.lifestyle = "singleton";
                    } else configurationValue = typeObj.$di.$current;
                    break;

                  case "object":
                    if (configurationValue.type) if ("ctor" === configurationValue.instance) delete configurationValue.lifestyle; else {
                        configurationValue.instance || (configurationValue.instance = "item");
                        configurationValue.lifestyle || (configurationValue.lifestyle = "transient");
                    }
                }
            }
            if (owner || !propFlag) diConfiguration[configurationProperty] = configurationValue; else {
                propFlag = !1;
                diConfiguration.$prop || (diConfiguration.$prop = {});
                diConfiguration.$prop[configurationProperty] = configurationValue;
                delete diConfiguration[configurationProperty];
            }
        }
        return diConfiguration;
    }, Moa = {
        clear: function() {
            var clearObj = function(obj) {
                var prop;
                for (prop in obj) delete obj[prop];
            };
            clearObj(map);
            clearObj(mixins);
        },
        define: function(type, definition) {
            var mapObj, baseType, base, len = arguments.length;
            switch (len) {
              case 1:
                mapObj = map[type];
                throwWrongType(mapObj, type);
                break;

              case 2:
                switch (typeof definition) {
                  case "function":
                    baseType = definition().$extend;
                    if (baseType !== undef) {
                        base = map[baseType];
                        throwWrongType(base, baseType);
                        mapObj = build(type, base, definition(base.$base));
                    } else mapObj = build(type, undef, definition(undef));
                    break;

                  case "object":
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
                map[type].$di = resolveDeclaration(type, mapObj.$di);
                break;

              default:
                throwWrongParamsErr("define");
            }
            return mapObj.$ctor;
        },
        resolve: function(type, paramsObj) {
            var item, mapObj = map[type], len = arguments.length, fnResolveListConf = function(target, config, fnResolveObjConf) {
                var prop, propValue;
                for (prop in config) {
                    propValue = config[prop];
                    target[prop] = "object" == typeof propValue ? fnResolveObjConf(propValue, fnResolveListConf) : propValue;
                }
                return target;
            }, createItem = function(declaration, obj, fnResolveObjConf, cParams) {
                var item, conf, proto;
                cParams = cParams || {};
                conf = declaration.$ctor;
                conf && (cParams = fnResolveListConf(cParams, conf, fnResolveObjConf));
                conf = declaration.$proto;
                if (conf && !conf.resolved) {
                    proto = fnResolveListConf({}, conf, fnResolveObjConf);
                    fastExtend(obj.$ctor.prototype, proto);
                    conf.resolved = !0;
                }
                item = new obj.$ctor(cParams);
                conf = declaration.$prop;
                conf && (item = fnResolveListConf(item, conf, fnResolveObjConf));
                return item;
            }, fnResolveObjConf = function(declaration, ctorParams) {
                var resolvedObj, current = declaration.$current;
                if (current) resolvedObj = map[current.type]; else {
                    current = declaration;
                    resolvedObj = map[current.type];
                    if (!resolvedObj) return declaration;
                    declaration = resolvedObj.$di;
                }
                switch (current.instance) {
                  case "item":
                    switch (current.lifestyle) {
                      case "transient":
                        item = createItem(declaration, resolvedObj, fnResolveObjConf, ctorParams);
                        break;

                      case "singleton":
                        current.item || (current.item = createItem(declaration, resolvedObj, fnResolveObjConf, ctorParams));
                        item = current.item;
                        break;

                      default:
                        throwWrongParamsErr("resolve", type + "::$di::$current::lifestyle");
                    }
                    break;

                  case "ctor":
                    item = resolvedObj.$ctor;
                    break;

                  default:
                    throwWrongParamsErr("resolve", type + "::$di::$current::instance");
                }
                return item;
            };
            1 !== len && 2 !== len && throwWrongParamsErr("resolve");
            throwWrongType(mapObj, type);
            item = fnResolveObjConf(mapObj.$di, paramsObj);
            return item;
        },
        mixin: function(mixType, definition) {
            if (null !== definition) {
                "function" != typeof definition && throwWrongParamsErr("mixin", "definition");
                mixins[mixType] = definition;
            } else delete mixins[mixType];
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
            delete result.$di;
            result.$di = JSON.parse(JSON.stringify(mapObj.$di));
            return result;
        }
    };
    "undefined" != typeof define ? define("Moa", [], function() {
        return Moa;
    }) : "undefined" != typeof window ? window.Moa = Moa : module.exports = Moa;
}();