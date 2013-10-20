/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 7:32
 */
/*global define:true*/
define('obj', ['tool', 'str'], function (tool, str) {
    'use strict';
    var map = {},
        /**
         * @type {{define: Function, create: Function}}
         */
        obj = {
            /**
             * @class obj
             * @method define
             * @param objName - name of object type
             * @param secondParam - can be two types
             *      - parent name of object type
             *      - implementation of behavior for current type of object
             * @param thirdParam - if you use inheritance in second params,
             *                     implementation of behavior for current type of object
             */
            define: function (objName, secondParam, thirdParam) {
                var me = this;
            },
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