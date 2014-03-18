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
        fn = 'function',
        ob = 'object',
        un = 'undefined',
        str = 'string',
        map = {},
        mixins = {},
        di = {},
        extend = function (target, source) {
            var prop;
            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
            //Some Object methods are not enumerable on Internet Explorer
            target.toString = source.toString;
            target.valueOf = source.valueOf;
            target.toLocaleString = source.toLocaleString;
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
            delete di[type];
            return {
                $type: type,
                $basetype: basetype,
                $mixin: $mixin,
                $di: $di,
                $ctor: $ctor,
                $base: $base
            };
        },
        resolveType = function (conf, prop, mapObj) {
            switch (conf.instance) {
            case 'item':
                switch (conf.lifestyle) {
                case 'transient':
                    conf.ctor = mapObj.$ctor;
                    break;
                case 'singleton':
                    conf.item = undef;
                    break;
                default:
                    throwWrongParamsErr('resolve', '$di::' + prop + '::lifestyle');
                }
                break;
            case 'ctor':
                conf.ctor = mapObj.$ctor;
                break;
            default:
                throwWrongParamsErr('resolve', '$di::' + prop + '::instance');
            }
            return conf;
        },
        resolveDeclaration = function (conf) {
            var prop, mapObj, confValue,
                result = {};
            for (prop in conf) {
                if (prop !== '$ctor') {
                    confValue = conf[prop];
                    if (typeof confValue === str) {
                        confValue = {
                            type: confValue,
                            instance: 'item',
                            lifestyle: 'transient'
                        };
                    }
                    mapObj = map[confValue.type];
                    if (mapObj) {
                        confValue = resolveType(confValue, prop, mapObj);
                        result[prop] = confValue;
                    } else {
                        result[prop] = conf[prop];
                    }
                }
            }
            return result;
        },
        /**
         @class Moa
        */
        Moa = {
            /**
             * Define new or inherited type
             * @method define
             * @param type {string} name of object type
             * @param definition {Object / Function} implementation of behavior for current type of object. If it is null - delete declared object
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
                    case fn:
                        baseType = definition().$extend;
                        if (baseType !== undef) {
                            base = map[baseType];
                            throwWrongType(base, baseType);
                            mapObj = build(type, base, definition(base.$base));
                        } else {
                            mapObj = build(type, undef, definition(undef));
                        }
                        break;
                    case ob:
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
                    break;
                default:
                    throwWrongParamsErr('define');
                }
                return mapObj.$ctor;
            },
            /**
             * Declare new mixin type
             * @method mixin
             * @param mixType {string} name of mixin type
             * @param definition {Function} implementation of behavior for mixin.
             */
            mixin: function (mixType, definition) {
                if (definition !== null) {
                    if (typeof definition !== fn) {
                        throwWrongParamsErr('mixin', 'definition');
                    }
                    mixins[mixType] = definition;
                } else {
                    delete mixins[mixType];
                }
            },
            resolve: function (type, config) {

                var prop, result, mapObj,
                    Ctor, confCtor, confProp,
                    objCtor, objProp, diConf,
                    len = arguments.length,
                    resolveObject = function (conf) {
                        var prop, value,
                            result = {};
                        if (conf) {
                            for (prop in conf) {
                                value = conf[prop];
                                switch (value.instance) {
                                    case 'item':
                                        if (conf.lifestyle === 'singleton') {
                                            if (!value.item) {
                                                value.item = Moa.resolve(conf.type);
                                            }
                                            result[prop] = value.item;
                                        } else {
                                            result[prop] = Moa.resolve(conf.type);
                                        }
                                        break;
                                    case 'ctor':
                                        result[prop] = value.ctor;
                                        break;
                                    default:
                                }
                            }
                        }
                        return result;
                    };
                if (len !== 1 && len !== 2) {
                    throwWrongParamsErr('resolve');
                } else {
                    if (len === 1) {
                        config = {};
                    }
                }
                mapObj = map[type];
                throwWrongType(mapObj, type);
                diConf = mapObj.$di;
                if (diConf) {
                    if (di[type]) {
                        confCtor = di[type].ctor;
                        confProp = di[type].prop;
                    } else {
                        confCtor = resolveDeclaration(diConf.$ctor);
                        confProp = resolveDeclaration(diConf);
                        di[type] = {
                            ctor: confCtor,
                            prop: confProp
                        };
                    }
                    objCtor = resolveObject(confCtor);
                    objProp = resolveObject(confProp);
                    if (diConf.$ctor) {
                        config = extend(config, objCtor);
                    }
                }
                Ctor = Moa.define(type);
                result = new Ctor(config);
                for (prop in objProp) {
                    result[prop] = objProp[prop];
                }
                return result;
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
                return result;
            }
        };
    // Return as AMD module or attach to head object
    if (typeof define !== un) {
        define([], function () { return Moa; });
    } else if (typeof window !== un) {
        window.Moa = Moa;
    } else {
        module.exports = Moa;
    }
}());