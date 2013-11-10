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
        map = {},
        extend = function (target, source) {
            var prop;
            for (prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
            return target;
        },
        wrongParamsErr = function (method, param) {
            var msg = 'Wrong parameters in ' + method;
            if (param) {
                msg = 'Wrong parameter ' + param + ' in ' + method;
            }
            return new Error(msg, 'Moa');
        },
        wrongType = function (extendType) {
            return new Error('Type ' + extendType + ' not found', 'Moa');
        },
        build = function (type, base, definition) {
            /*
                $mixin string / [string]
            */
            var basetype,
                $single = definition.$single,
                $static = definition.$static,
                $ctor = definition.$ctor,
                $base = {};
            if ($ctor !== undef) {
                delete definition.$ctor;
            } else {
                $ctor = function () {};
            }
            delete definition.$single;
            delete definition.$static;
            delete definition.$extend;
            if ($static !== undef) {
                extend($ctor, $static);
            }
            if (base !== undef) {
                basetype = base.$basetype;
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
            //} else {
            }
            $base.$ctor = $ctor;
            return {
                $type: type,
                $basetype: basetype,
                $ctor: $ctor,
                $base: $base
            };
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
                    if (!mapObj) {
                        throw wrongType(type);
                    }
                    break;
                case 2:
                    switch (typeof definition) {
                    case fn:
                        baseType = definition().$extend;
                        if (baseType !== undef) {
                            base = map[baseType];
                            if (base === undef) {
                                throw wrongType(baseType);
                            }
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
                                if (base === undef) {
                                    throw wrongType(baseType);
                                }
                            }
                            mapObj = build(type, base, definition);
                        } else {
                            delete map[type];
                            return undef;
                        }
                        break;
                    default:
                        throw wrongParamsErr('define', 'definition');
                    }
                    map[type] = mapObj;
                    break;
                default:
                    throw wrongParamsErr('define');
                }
                return mapObj.$ctor;
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