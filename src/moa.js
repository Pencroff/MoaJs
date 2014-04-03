/**
 * Created with WebStorm.
 * Project: MoaJs
 * User: Sergii Danilov
 * Date: 10/31/13
 * Time: 6:10 PM
 */
/*global define:true, module:true*/
/**
 Prototype inheritance and extensions in JavaScript
 @module Moa
 */
(function () {
    "use strict";
    if (!Object.create) {
        Object.create = (function () {
            function F() {}
            return function (o) {
                if (arguments.length !== 1) {
                    throw new Error('Object.create implementation only accepts one parameter.');
                }
                F.prototype = o;
                return new F();
            };
        }());
    }
    var undef,
        map = {},
        mixins = {},
        extend = function (target, source) {
            var prop;
            if (source) {
                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
                //Some Object methods are not enumerable on Internet Explorer
                target.toString = source.toString;
                target.valueOf = source.valueOf;
                target.toLocaleString = source.toLocaleString;
            }
            return target;
        },
        fastExtend = function (target, source) {
            var prop;
            if (source) {
                for (prop in source) {
                    target[prop] = source[prop];
                }
            }
            return target;
        },
        throwWrongParamsErr = function (method, param) {
            var msg = 'Wrong parameters in ' + method;
            if (param) {
                msg = 'Wrong parameter ' + param + ' in ' + method;
            }
            throw new Error(msg, 'Moa');
        },
        throwWrongType = function (obj, extendType, isMixin) {
            var type = 'Type ';
            if (obj === undef) {
                if (isMixin === true) {
                    type = 'Mixin type ';
                }
                throw new Error(type + extendType + ' not found', 'Moa');
            }
        },
        addMixins = function ($proto, $mixin) {
            var prop,
                value,
                MixFn;
            for (prop in $mixin) {
                value = $mixin[prop];
                MixFn = mixins[value];
                throwWrongType(MixFn, value, true);
                MixFn.call($proto);
                $proto[prop] = new MixFn();
            }
            return $proto;
        },
        build = function (type, base, definition) {
            var basetype,
                $staticMixin,
                $single = definition.$single,
                $static = definition.$static,
                $mixin = definition.$mixin,
                $ctor = definition.$ctor,
                $di = definition.$di,
                $base = {};
            if ($ctor !== undef) {
                delete definition.$ctor;
            } else {
                $ctor = function () {};
            }
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
            if ($mixin !== undef) {
                definition = extend(addMixins({}, $mixin), definition);
            }
            if (base !== undef) {
                basetype = base.$type;
                definition = extend(Object.create(base.$ctor.prototype), definition);
            }
            definition.getType = function () {
                return type;
            };
            extend($base, definition);
            $ctor.prototype = definition;
            $ctor.prototype.constructor = $ctor;
            if ($single !== undef && $single === true) {
                (function () {
                    var instance = new $ctor();
                    $ctor = function () {
                        return instance;
                    };
                    $ctor.getInstance = function () {
                        return instance;
                    };
                }());
            }
            $base.$ctor = $ctor;
            return {
                $type: type,
                $basetype: basetype,
                $mixin: $mixin,
                $di: $di,
                $ctor: $ctor,
                $base: $base
            };
        },
        resolveDeclaration = function (type, diConfiguration, owner) {
            var configurationProperty, configurationValue, configurationValueType,
                typeObj, propFlag = false;
            diConfiguration = diConfiguration || {};
            if (!diConfiguration.$current) {
                diConfiguration.$current = type;
            }
            for (configurationProperty in diConfiguration) {
                configurationValue = diConfiguration[configurationProperty];
                configurationValueType = typeof configurationValue;
                switch (configurationProperty) {
                case '$current':
                    switch (configurationValueType) {
                    case 'string':
                        configurationValue = {
                            type: configurationValue,
                            instance: 'item',
                            lifestyle: 'transient'
                        };
                        break;
                    case 'object':
                        configurationValue.type = type;
                        if (!configurationValue.instance) {
                            configurationValue.instance = 'item';
                        }
                        if (!configurationValue.lifestyle && configurationValue.instance !== 'ctor') {
                            configurationValue.lifestyle = 'transient';
                        }
                        break;
                    default:
                    }
                    break;
                case '$ctor':
                    configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
                    delete configurationValue.$current;
                    break;
//                case '$proto':
//                    configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
//                    delete configurationValue.$current;
//                    break;
                case '$prop':
                    configurationValue = resolveDeclaration(type, configurationValue, configurationProperty);
                    delete configurationValue.$current;
                    break;
                default:
                    propFlag = true;
                    switch (configurationValueType) {
                    case 'string':
                        typeObj = map[configurationValue];
                        if (typeObj) {
                            configurationValue = typeObj.$di.$current;
                        }
                        break;
                    case 'object':
                        if (configurationValue.type) {
                            if (configurationValue.instance === 'ctor') {
                                delete configurationValue.lifestyle;
                            } else {
                                if (!configurationValue.instance) {
                                    configurationValue.instance = 'item';
                                }
                                if (!configurationValue.lifestyle) {
                                    configurationValue.lifestyle = 'transient';
                                }
                            }
                        }
                        break;
                    default:
                    }
                }
                if (owner || !propFlag) {
                    diConfiguration[configurationProperty] = configurationValue;
                } else {
                    propFlag = false;
                    if (!diConfiguration.$prop) {
                        diConfiguration.$prop = {};
                    }
                    diConfiguration.$prop[configurationProperty] = configurationValue;
                    delete diConfiguration[configurationProperty];
                }
            }
            return diConfiguration;
        },
        /**
         @class Moa
        */
        Moa = {
            clear: function () {
                var clearObj = function (obj) {
                    var prop;
                    for (prop in obj) {
                        delete obj[prop];
                    }
                };
                clearObj(map);
                clearObj(mixins);
            },
            /**
             * Define new or inherited type
             * @method define
             * @param type {string} name of object type
             * @param definition {(Object|function)} implementation of behavior for current type of object. If it is null - delete declared object
             * @return {function} constructor of defined object type
             */
            define: function (type, definition) {
                var mapObj, baseType, base,
                    len = arguments.length;
                switch (len) {
                case 1:
                    mapObj = map[type];
                    throwWrongType(mapObj, type);
                    break;
                case 2:
                    switch (typeof definition) {
                    case 'function':
                        baseType = definition().$extend;
                        if (baseType !== undef) {
                            base = map[baseType];
                            throwWrongType(base, baseType);
                            mapObj = build(type, base, definition(base.$base));
                        } else {
                            mapObj = build(type, undef, definition(undef));
                        }
                        break;
                    case 'object':
                        if (definition !== null) {
                            baseType = definition.$extend;
                            if (baseType !== undef) {
                                base = map[baseType];
                                throwWrongType(base, baseType);
                            }
                            mapObj = build(type, base, definition);
                        } else {
                            delete map[type];
                            return undef;
                        }
                        break;
                    default:
                        throwWrongParamsErr('define', 'definition');
                    }
                    map[type] = mapObj;
                    map[type].$di = resolveDeclaration(type, mapObj.$di);
                    break;
                default:
                    throwWrongParamsErr('define');
                }
                return mapObj.$ctor;
            },
            resolve: function (type, configObj) {
                var item,
                    //depthRecursion = 64, cntRecursion = 0,
                    mapObj = map[type],
                    len = arguments.length,
                    fnResolveListConf = function (target, config, fnResolveObjConf) {
                        var prop, propValue;
                        for (prop in config) {
                            propValue = config[prop];
                            if (typeof propValue === 'object') {
                                target[prop] = fnResolveObjConf(propValue, fnResolveListConf);
                            } else {
                                target[prop] = propValue;
                            }
                        }
                        return target;
                    },
                    createItem = function (declaration, obj, fnResolveObjConf, cParams) {
                        var item, conf;
                        cParams = cParams || {};
                        conf = declaration.$ctor;
                        if (conf) {
                            cParams = fnResolveListConf(cParams, conf, fnResolveObjConf);
                        }
                        item = new obj.$ctor(cParams);
                        conf = declaration.$prop;
                        if (conf) {
                            item = fnResolveListConf(item, conf, fnResolveObjConf);
                        }
                        return item;
                    },
                    fnResolveObjConf = function (declaration, ctorParams) {
                        var resolvedObj,
                            current = declaration.$current;
                        /*==========================================================
                        if you have problem with IoC, just uncomment 3 rows bellow
                        and second row in 'resolve' function
                        =========================================================*/
//                        cntRecursion += 1;
//                        if (cntRecursion > depthRecursion) {
//                            throw new Error('Loop of recursion', 'moa');
//                        }
                        if (current) {
                            resolvedObj = map[current.type];
                        } else {
                            current = declaration;
                            resolvedObj = map[current.type];
                            if (resolvedObj) {
                                declaration = resolvedObj.$di;
                            } else {
                                return declaration;
                            }
                        }
                        switch (current.instance) {
                        case 'item':
                            switch (current.lifestyle) {
                            case 'transient':
                                item = createItem(declaration, resolvedObj, fnResolveObjConf, ctorParams);
                                break;
                            case 'singleton':
                                if (!current.item) {
                                    current.item = createItem(declaration, resolvedObj, fnResolveObjConf, ctorParams);
                                }
                                item = current.item;
                                break;
                            default:
                                throwWrongParamsErr('resolve', type + '::$di::$current::lifestyle');
                            }
                            break;
                        case 'ctor':
                            item = resolvedObj.$ctor;
                            break;
                        default:
                            throwWrongParamsErr('resolve', type + '::$di::$current::instance');
                        }
                        return item;
                    };
                if (len !== 1 && len !== 2) {
                    throwWrongParamsErr('resolve');
                }
                throwWrongType(mapObj, type);
                item = fnResolveObjConf(mapObj.$di, configObj);
                return item;
            },
            /**
             * Declare new mixin type
             * @method mixin
             * @param mixType {string} name of mixin type
             * @param definition {Function} implementation of behavior for mixin.
             */
            mixin: function (mixType, definition) {
                if (definition !== null) {
                    if (typeof definition !== 'function') {
                        throwWrongParamsErr('mixin', 'definition');
                    }
                    mixins[mixType] = definition;
                } else {
                    delete mixins[mixType];
                }
            },
            /**
             * Return object with lists of types and mixins
             * @method getRegistry
             */
            getRegistry: function () {
                var iterate = function (obj) {
                        var prop, arr = [];
                        for (prop in obj) {
                            arr.push(prop);
                        }
                        return arr;
                    };
                return {
                    type: iterate(map),
                    mixin: iterate(mixins)
                };
            },
            getTypeInfo: function (type) {
                var result,
                    mapObj = map[type];
                throwWrongType(mapObj, type);
                result = extend({}, mapObj);
                delete result.$ctor;
                delete result.$base;
                delete result.$di;
                result.$di = JSON.parse(JSON.stringify(mapObj.$di));
                return result;
            }
        };
    // Return as AMD module or attach to head object
    if (typeof define !== 'undefined') {
        define([], function () { return Moa; });
    } else if (typeof window !== 'undefined') {
        window.Moa = Moa;
    } else {
        module.exports = Moa;
    }
}());