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
    var map = {},
        fn = 'function',
        undef = 'undefined',
        extend = function (target, source, isOverride) {
            var prop;
            if (isOverride) {
                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            } else {
                for (prop in source) {
                    if (source.hasOwnProperty(prop)) {
                        if (!target[prop]) {
                            target[prop] = source[prop];
                        }
                    }
                }
            }
            return target;
        },
        notFoundErr = function (type) {
            return new Error('Object \'' + type + '\' not found', 'obj');
        },
        wrongParamsErr = function (method) {
            return new Error('Wrong parameters in ' + method, 'obj');
        },
        buildMapObj = function (t, o) {
            var isSingle = o.$isSingle,
                extendType = o.$extend,
                construct = o.$construct,
                parent,
                prop,
                $proto = {},
                //$obj = {},
                $mapObj = {
                    //$obj: $obj,
                    $proto: $proto,
                    $extend: extendType,
                    $mixin: o.$mixin,
                    $static: o.$static,
                    $isSingle: isSingle
                };
            if (typeof construct === fn) {
                delete o.$construct;
            } else {
                construct = function () {};
            }
            delete o.$isSingle;
            delete o.$extend;
            delete o.$mixin;
            delete o.$static;
            extend($proto, o, true);
            if (extendType) {
                parent = map[extendType];
                if (!parent) {
                    throw new Error('Base type not found');
                }
                $proto = extend(Object.create(parent.$proto), $proto, true);
                $proto.$base = parent.$constructor;
                $proto.$baseproto = parent.$proto;
                $mapObj.$proto = $proto;
            }
            $proto.$getType = function () {
                return t;
            };
            $mapObj.$constructor = construct;
//            function () {
//                extend(this, $obj, true);
//            };
            $mapObj.$constructor.prototype = $proto;
            $mapObj.$constructor.prototype.constructor = construct;
            return $mapObj;
        },
        /**
         @class Moa
        */
        Moa = {
            /**
             * Define new or inherited type
             * @method define
             * @param objName {string} name of object type
             * @param secondParam {Object} implementation of behavior for current type of object. If it is null - delete declared object
             * @return {function} constructor of defined object type
             */
            define: function (objName, secondParam) {
                var len = arguments.length,
                    mapObj;
                switch (len) {
                case 1:
                    mapObj = map[objName];
                    if (!mapObj) {
                        throw notFoundErr(objName);
                    }
                    break;
                case 2:
                    if (secondParam !== null) {
                        mapObj = buildMapObj(objName, secondParam);
                        map[objName] = mapObj;
                    } else {
                        delete map[objName];
                        return;
                    }
                    break;
                default:
                    throw wrongParamsErr('define');
                }
                return mapObj.$constructor;
            },
            /**
             * Factory for new exemplars
             * @method create
             * @param objName {string} name of object type
             * @param mergeObj {object} object for merging with implementing type (with override)
             * @return {object} new exemplar of selected type in first parameter
             */
            create: function (objName) {
                var len = arguments.length,
                    mapObj,
                    item,
                    args,
                    ret;
                mapObj = map[objName];
                if (!mapObj) {
                    throw notFoundErr(objName);
                }
                if (len === 1) {
                    return new mapObj.$constructor();
                } else {
                    item = Object.create(mapObj.$proto);
                    args = Array.prototype.slice.call(arguments, 1);
                    ret = mapObj.$constructor.apply(item, args);
                    return Object(ret) === ret ? ret : item;
                }
//                switch (len) {
//                case 1:
//                    mapObj = map[objName];
//                    if (!mapObj) {
//                        throw notFoundErr(objName);
//                    }
//                    item = new mapObj.$constructor();
//                    break;
//                case 2:
//                    mapObj = map[objName];
//                    if (!mapObj) {
//                        throw notFoundErr(objName);
//                    }
//                    item = new mapObj.$constructor();
//                    extend(item, mergeObj, true);
//                    break;
//                default:
//                    throw wrongParamsErr('create');
//                }
            }
        };
    // Return as AMD module or attach to head object
    if (typeof define !== undef) {
        define([], function () { return Moa; });
    } else if (typeof window !== undef) {
        window.Moa = Moa;
    } else {
        module.exports = Moa;
    }
}());