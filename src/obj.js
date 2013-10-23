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
                mapObj = {
                    $proto: {},
                    $obj: {}
                },
                proto = mapObj.$proto,
                obj = mapObj.$obj;
            for (prop in o) {
                if (o.hasOwnProperty(prop)) {
                    switch (typeof o[prop]) {
                    case fn:
                        proto[prop] = o[prop];
                        break;
                    default:
                        obj[prop] = o[prop];
                    }
                }
            }
            mapObj.$constructor = function () {
                tool.extend(this, obj, true);
            };
            mapObj.$constructor.prototype =  proto;
            return mapObj;
        },
        obj = {
            /**
             * Define new or inherited type
             * @method define
             * @param objName {string} name of object type
             * @param secondParam {String / Object} parent name of object type or implementation of behavior for current type of object
             *  if it is null - delete declared object
             * @param thirdParam {object} if you use inheritance in second params, implementation of behavior for current type of object
             * @return {function} constructor of defined object type
             */
            define: function (objName, secondParam, thirdParam) {
                var me = this,
                    paramsLen = arguments.length,
                    mapObj;
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
                        mapObj = buildMapObj(secondParam);
                        map[objName] = mapObj;
                    } else {
                        delete map[objName];
                        return;
                    }
                    break;
                case 3:

                    break;
                default:
                    throw new Error(err.wrngPrms + 'define', 'obj');
                }
                return mapObj.$constructor;
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