/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 7:32
 */
/*global define:true*/
/**
 Main part of MoaJs
 @class obj
 */
define('obj', ['tool', 'str'], function (tool, str) {
    'use strict';
    var map = {},
        err = str.err,
        fn = str._serv_.TFunc,
        buildMapObj = function (t, o) {
            var extend = tool.extend,
                isSingle = o.$isSingle,
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
        obj = {
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
                        throw new Error('Object \'' + objName + '\' didn\'t find', 'obj');
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
                    throw new Error('Wrong parameters in define', 'obj');
                }
                return $mapObj.$constructor;
            },
            /**
             * Factory for new exemplars
             * @method create
             * @param objName {string} name of object type
             * @param mergeObj {object} object for merging with implementing type
             * @return {object} new exemplar of selected type in first parameter
             */
            create: function (objName, mergeObj) {
                var me = this;
            }
        };
    return obj;
});