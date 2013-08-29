/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 27.08.2013
 * Time: 7:32
 */
/*global define:true*/
define('obj', ['tool', 'str'], function (tool, str) {
    'use strict';
    var map = {},
        obj = function (objName, objProp) {
            var me = this,
                result;
            if (!tool.isStr(objName)) {
                throw new Error(str.err.notStr);
            }
            if (!tool.isObj(objProp) && !tool.isUndef(objProp)) {
                throw new Error(str.err.notObj);
            }
            if (tool.isObj(objProp)) {
                map[objName] = objProp;
            }

            return map[objName];
        };
    return obj;
});