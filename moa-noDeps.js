
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
    
    var map = {},
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
        fn = 'function',
        notFoundErr = function (type) {
            return new Error('Object \'' + type + '\' not found', 'obj');
        },
        wrongParamsErr = function (method) {
            return new Error('Wrong parameters in ' + method, 'obj');
        },
        buildMapObj = function (t, o) {
            var isSingle = o.$isSingle,
                extendType = o.$extend,
                parent,
                prop,
                $proto = {},
                $obj = {},
                $mapObj = {
                    $obj: $obj,
                    $proto: $proto,
                    $extend: extendType,
                    $mixin: o.$mixin,
                    $static: o.$static,
                    $isSingle: isSingle
                };
            delete o.$isSingle;
            delete o.$extend;
            delete o.$mixin;
            delete o.$static;
            for (prop in o) {
                if (o.hasOwnProperty(prop)) {
                    switch (typeof o[prop]) {
                        case fn:
                            $proto[prop] = o[prop];
                            break;
                        default:
                            $obj[prop] = o[prop];
                    }
                }
            }
            if (extendType) {
                parent = map[extendType];
                if (!parent) {
                    throw new Error('Base type not found');
                }
                extend($obj, parent.$obj, false);
                $proto = extend(Object.create(parent.$proto), $proto, true);
                $proto.$base = parent.$constructor;
                $proto.$baseproto = parent.$proto;
                $proto.$getType = function () {
                    return t;
                };
                $mapObj.$proto = $proto;
            }
            $mapObj.$constructor = function () {
                extend(this, $obj, true);
            };
            $mapObj.$constructor.prototype = $proto;
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
                var me = this,
                    paramsLen = arguments.length,
                    $mapObj;
                switch (paramsLen) {
                case 1:
                    $mapObj = map[objName];
                    if (!$mapObj) {
                        throw notFoundErr(objName);
                    }
                    break;
                case 2:
                    if (secondParam !== null) {
                        $mapObj = buildMapObj(objName, secondParam);
                        map[objName] = $mapObj;
                    } else {
                        delete map[objName];
                        return;
                    }
                    break;
                default:
                    throw wrongParamsErr('define');
                }
                return $mapObj.$constructor;
            },
            /**
             * Factory for new exemplars
             * @method create
             * @param objName {string} name of object type
             * @param mergeObj {object} object for merging with implementing type (with override)
             * @return {object} new exemplar of selected type in first parameter
             */
            create: function (objName, mergeObj) {
                var paramsLen = arguments.length,
                    $mapObj,
                    exemplar;
                switch (paramsLen) {
                case 1:
                    $mapObj = map[objName];
                    if (!$mapObj) {
                        throw notFoundErr(objName);
                    }
                    exemplar = new $mapObj.$constructor();
                    break;
                case 2:
                    $mapObj = map[objName];
                    if (!$mapObj) {
                        throw notFoundErr(objName);
                    }
                    exemplar = new $mapObj.$constructor();
                    extend(exemplar, mergeObj, true);
                    break;
                default:
                    throw wrongParamsErr('create');
                }
                return exemplar;
            }
        };
    // Return as AMD module or attach to head object
    if (typeof define !== 'undefined') {
        define('moa-noDeps',[], function () { return Moa; });
    } else if (typeof window !== 'undefined') {
        window.Moa = Moa;
    } else {
        module.exports = Moa;
    }
}());