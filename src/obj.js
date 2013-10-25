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
        buildMapObj = function (o) {
            var prop,
                $constructor,
                $extend,
                $private,
                $static,
                $isSingle,
                $instance,
                $proto = {},
                $obj = {};
            $extend = o.$extend;
            $private = o.$private;
            $static = o.$static;
            $isSingle = o.$isSingle;
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
            $constructor = function () {
                tool.extend(this, $obj, true);
            };
            $constructor.prototype =  $proto;

            return $constructor;
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
                    $fn;
//                mapObj = {
//                    constructor: function () {},
//                    isSingleton: false,
//                    instance: null,
//                    $proto: null,
//                    $exemplar: null
//                };
                switch (paramsLen) {
                case 1:

                    break;
                case 2:
                    if (secondParam !== null) {
                        $fn = buildMapObj(secondParam);
                        map[objName] = $fn;
                    } else {
                        delete map[objName];
                        return;
                    }
                    break;
                default:
                    throw new Error(err.wrngPrms + 'define', 'obj');
                }
                return $fn;
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