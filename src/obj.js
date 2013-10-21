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
        obj = {
            /**
             * Define new or inherited type
             * @method define
             * @param objName {string} name of object type
             * @param secondParam {String / Object} parent name of object type or implementation of behavior for current type of object
             * @param thirdParam {object} if you use inheritance in second params, implementation of behavior for current type of object
             * @return {function} constructor of defined object type
             */
            define: function (objName, secondParam, thirdParam) {
                var me = this;
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
//        obj = function (objName, objProp) {
//            var me = this,
//                result;
//            if (!tool.isStr(objName)) {
//                throw new Error(str.err.notStr);
//            }
//            if (!tool.isObj(objProp) && !tool.isUndef(objProp)) {
//                throw new Error(str.err.notObj);
//            }
//            if (tool.isObj(objProp)) {
//                map[objName] = objProp;
//            }
//
//            return map[objName];
//        };
    return obj;
});